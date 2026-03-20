'use client'
import React from 'react'
import PicModal from './PicModal'
import { CTA } from '@repo/ui'
import AddPlanModal from './AddPlanModal'
import VisualizerMenu, { SelectOption } from '../../molecules/VisualizerMenu/VisualizerMenu'
import ProjectFolders from '../ProjectFolders/ProjectFolders'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Document, Page, pdfjs } from 'react-pdf';
import { usePlanStore } from '@/stores/AllPlansStore'
// Configuration obligatoire du worker pour react-pdf (compatible Next.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

export type MarkerType = {
  id: number,
  x: number,
  y: number,
  title: string,
  comment: string
  photoUrl: string | ArrayBuffer | null
}

interface PlanLoaderProps {
  projectId: string;
}

function PlanLoader({ projectId }: PlanLoaderProps) {

  const [markers, setMarkers] = React.useState<MarkerType[]>([]);
  const currentClickCoords = React.useRef({x: 0, y: 0})
  const [nextMarkerId, setNextMarkerId] = React.useState<number>(1);
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false)
  const [modalCurrentMarker, setModalCurrentMarker] = React.useState<MarkerType | undefined>(undefined)
  const [isAddPlanModalActive, setIsAddPlanModalActive] = React.useState<boolean>(false);


  // État pour gérer le fichier (PDF ou Image)
  const [currentFileUrl, setCurrentFileUrl] = React.useState<string | null>(null);
  const [isPdf, setIsPdf] = React.useState<boolean>(false);

  const setCurrentPlan = usePlanStore((state) => state.setCurrentPlan);
  const currentPlan = usePlanStore((state) => state.currentPlan);

  const planUploadContainerRef = React.useRef<HTMLDivElement | null>(null);
  const planContainerRef = React.useRef<HTMLDivElement | null>(null)
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  const [option, setOption] = React.useState<SelectOption>('hand');

  function selectOption(option: SelectOption) {
    setOption(option);
  }

  function displayPlan(id: string, planName: string, storageKey: string, temporaryAccessUrl: string, isPdfDocument: boolean) {
    
    setIsPdf(isPdfDocument);
    setCurrentFileUrl(temporaryAccessUrl);
    setCurrentPlan({ id, name: planName, storageKey: storageKey, temporaryAccessUrl, isPdfDocument: isPdfDocument });

    setMarkers([]);
    setNextMarkerId(1);
  }

  function handlePlanClick(event: React.MouseEvent) {
     if(option !== 'pin') return;
    // Empêcher le clic de se déclencher si on est en train de "glisser/panner" le plan
    // ou si on clique sur un marqueur
    if (event.currentTarget.classList.contains('marker')) return;
    if (!planContainerRef.current || !photoInputRef.current) return;

    const rect = planContainerRef.current.getBoundingClientRect();
    
    // Le calcul en pourcentage reste parfait même avec le zoom !
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    currentClickCoords.current = {x, y};
    photoInputRef.current.click();
  }

  function chooseMarkerPic(event: React.ChangeEvent<HTMLInputElement>){

    const files = event.target.files
    if(!files) return

    const file = files[0]

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if(!e.target) return;

          const newMarker: MarkerType = {
              id: nextMarkerId,
              x: currentClickCoords.current.x,
              y: currentClickCoords.current.y,
              title: '',
              comment: '',
              photoUrl: e.target.result
          };

          setMarkers([...markers, newMarker]);

          //permettre d'ajouter un titre et des commentaires dès l'ajout du marqueur
          setIsModalActive(true);
          setModalCurrentMarker(newMarker)

          setNextMarkerId(prevId => prevId + 1);
          console.log(nextMarkerId)
        };
        reader.readAsDataURL(file);

        // Réinitialiser l'input pour permettre de charger la même photo plusieurs fois
        if(!photoInputRef.current) return
        photoInputRef.current.value = '';
    }
  }

  function handleMarkerClick(event: React.MouseEvent, marker: MarkerType) {
    event.stopPropagation();
    setModalCurrentMarker(marker)
    setIsModalActive(true);
  }

  function handleCloseModal(){
    setIsModalActive(false)
  }

  function handleSetText(e: React.ChangeEvent, marker: MarkerType){
    const { name, value } = e.target as HTMLInputElement;

    const updatedMarker  = { ...marker, [name === 'pic-title' ? 'title' : 'comment']: value };
    setMarkers(prevMarkers => 
      prevMarkers.map(markerItem => 
        markerItem.id === marker.id ? { ...updatedMarker } : markerItem
      )
    );

    setModalCurrentMarker(updatedMarker); 
  }

  function handleDeleteMarker(marker: MarkerType){
    setMarkers(prevMarkers => prevMarkers.filter(m => m.id !== marker.id));
    setIsModalActive(false);
    setModalCurrentMarker(undefined);
  }

  return (
    <div className="relative w-full h-[calc(100vh-88px)] bg-gray-100 overflow-hidden flex flex-col">
      
      {!currentFileUrl ? (
        <div id="plan-upload-container" className="w-full max-w-sm relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-6 rounded-lg border border-gray-200" ref={planUploadContainerRef}>
          <div className="text-center mb-4">
            <h2 className="block text-lg font-medium mb-2">Vous n'avez aucun plan pour le moment</h2>
            <p>Chargez-en un ici</p>
          </div>

          <div className="flex justify-center">
            <CTA 
              color="primary"
              type='button'
              text='Charger un plan'
              onClick={() => setIsAddPlanModalActive(true)}
            />
          </div>
        </div>
      ) : (
        // Conteneur qui contient le plan

        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8} // Zoom max
          // centerOnInit={true}
          wheel={{ step: 0.1 }} // Sensibilité de la molette
          panning={{ velocityDisabled: true }} // Rend le glissement plus précis
        >

          {({zoomIn, zoomOut, resetTransform}) => (
            <>
              {/* Petits boutons de contrôle flottants (Optionnel mais UX friendly) */}
              <div className="absolute top-4 right-4 z-30 flex gap-2 bg-white p-2 rounded-lg shadow-md">
                <button onClick={() => zoomOut()} className="p-2 bg-gray-100 hover:bg-gray-200 rounded">-</button>
                <button onClick={() => resetTransform()} className="p-2 bg-gray-100 hover:bg-gray-200 rounded">Reset</button>
                <button onClick={() => zoomIn()} className="p-2 bg-gray-100 hover:bg-gray-200 rounded">+</button>
              </div>

              <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                <div ref={planContainerRef} className='relative bg-white' onClick={handlePlanClick}>
                  {isPdf ? (
                      <Document file={currentFileUrl}>
                        {/* On ne rend que la page 1. La prop 'width' peut être définie si tu veux forcer une taille */}
                        <Page pageNumber={1} renderTextLayer={false} renderAnnotationLayer={false} />
                      </Document>
                    ) : (
                      <img src={currentFileUrl} alt="Plan" className="max-w-none" />
                    )
                  }

                    {/* Affichage des marqueurs (ton code intact) */}
                    {markers.map((marker, index) => (
                      <div
                        key={index}
                        className="marker absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10"
                        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                        onClick={(e) => handleMarkerClick(e, marker)}
                      >
                        {marker.id}
                      </div>
                    ))}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}



      {/* Input caché pour le chargement des photos */}
      <input
        type="file"
        id="photo-input"
        accept="image/*"
        className='hidden'
        ref={photoInputRef}
        onChange={chooseMarkerPic}
      />

      {currentPlan && <VisualizerMenu option={option} selectOption={selectOption}/>}
      

      <PicModal
        isActive={isModalActive}
        marker={modalCurrentMarker}
        handleSetText={handleSetText}
        handleDeleteMarker={handleDeleteMarker}
        handleClose={handleCloseModal}
      />

      <AddPlanModal
        projectId={projectId}
        isActive={isAddPlanModalActive}
        onClose={() => setIsAddPlanModalActive(false)}
        handleUploadPlan={displayPlan}
      />

      <ProjectFolders />
    </div>
  )
}

export default PlanLoader