'use client'
import React, { useEffect } from 'react'
import PicModal from './PicModal'
import { CTA } from '@repo/ui'
import AddPlanModal from './AddPlanModal'
import VisualizerMenu, { SelectOption } from '../../molecules/VisualizerMenu/VisualizerMenu'
import ProjectFolders from '../ProjectFolders/ProjectFolders'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Document, Page, pdfjs } from 'react-pdf';
import { usePlanStore } from '@/stores/AllPlansStore'
import { addMarker, deleteMarker, editMarker, getLastOpenedPlan, getMarkers } from '@/proxy/plan/plan-functions'
import { MarkerPhotoType, MarkerType } from '@/types/project'
// Configuration obligatoire du worker pour react-pdf (compatible Next.js)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';

interface PlanLoaderProps {
  projectId: string;
}

function PlanLoader({ projectId }: PlanLoaderProps) {
  const [markers, setMarkers] = React.useState<MarkerType[]>([]);
  const currentClickCoords = React.useRef({x: 0, y: 0})
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false)
  const [temporaryModalMarker, setTemporaryModalMarker] = React.useState<MarkerType | undefined>(undefined)
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
              coordX: currentClickCoords.current.x,
              coordY: currentClickCoords.current.y,
              title: '',
              photos: [
                {
                  label: '',
                  comment: '',
                  previewUrl: e.target.result as string,
                  physicalFile: file
                }
              ]
          };

          //permettre d'ajouter un titre et des commentaires dès l'ajout du marqueur
          setIsModalActive(true);
          setTemporaryModalMarker(newMarker);

        };
        reader.readAsDataURL(file);

        // Réinitialiser l'input pour permettre de charger la même photo plusieurs fois
        if(!photoInputRef.current) return
        photoInputRef.current.value = '';
    }
  }

  async function handleAddMarker(marker: MarkerType){
    // Call API pour sauvegarder le marqueur dans la BDD et récupérer son ID généré

    const markerFormData = new FormData();

    const markertoRegister = {
      title: marker.title,
      coordX: marker.coordX,
      coordY: marker.coordY,
      photosMetaData: marker.photos.map(photo => ({
        label: photo.label,
        comment: photo.comment,
      })),
    }

    markerFormData.append('markerData', JSON.stringify(markertoRegister));

    marker.photos.forEach((photo) => {
      markerFormData.append('photos', photo.physicalFile);
    });

    try{
      const response = await addMarker(markerFormData, projectId, currentPlan?.id as string);
      if(!response.ok){
        console.error("Erreur lors de l'ajout du marqueur :", response.statusText);
        return;
      } else {
        const result = await response.json();
        
        setMarkers(prevMarkers => [...prevMarkers, result]);
        setTemporaryModalMarker(undefined);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du marqueur :", error);
    }
  }

  async function updateMarkerPhoto(marker: MarkerType){
    const updateMarkerFormData = new FormData();

    const existingPhotos = marker.photos.filter(photo => photo.id);
    const newPhotos = marker.photos.filter(photo => !photo.id);

    const matchingMarker = markers.find(m => m.id === marker.id)
    const keptPhotoIdentifiersSet = new Set(existingPhotos.map(photoItem => photoItem.id));

    // 3. On extrait les identifiants supprimés de manière sécurisée
    const deletedPhotoIdentifiers = matchingMarker?.photos
      .map(photoItem => photoItem.id)
      .filter(photoIdentifier => !keptPhotoIdentifiersSet.has(photoIdentifier)) || [];

    const markerToUpdatePayload = {
      title: marker.title,
      coordX: marker.coordX,
      coordY: marker.coordY,

      // On envoie les métadonnées des photos existantes pour les mettre à jour
      existingPhotosToUpdate: existingPhotos.map(photoItem => ({
        identifier: photoItem.id,
        label: photoItem.label,
        comment: photoItem.comment,
      })),

      // On envoie les métadonnées des nouvelles photos
      newPhotosMetadata: newPhotos.map(photoItem => ({
        label: photoItem.label,
        comment: photoItem.comment,
      })),

      deletedPhotoIdentifiers: deletedPhotoIdentifiers
    }

    updateMarkerFormData.append('markerData', JSON.stringify(markerToUpdatePayload));

    newPhotos.forEach((photo) => {
      updateMarkerFormData.append('newPhotos', photo.physicalFile);
    });

    try{
      const response = await editMarker(projectId, currentPlan?.id as string, marker.id as string, updateMarkerFormData);
      if(!response.ok){
        console.error("Erreur lors de la mise à jour du marqueur :", response.statusText);
        return;
      } else {
        const result = await response.json();
        const updatedMarker = result.updatedMarker;
        
        setMarkers(prevMarkers => prevMarkers.map(m => m.id === marker.id ? updatedMarker : m));
        setTemporaryModalMarker(undefined);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du marqueur :", error);
    }
    
  }

  function handleMarkerClick(event: React.MouseEvent, marker: MarkerType) {
    event.stopPropagation();
    setIsModalActive(true);
    setTemporaryModalMarker(marker);
  }

  function handleCloseModal(){
    setIsModalActive(false)
    setTemporaryModalMarker(undefined);
  }

  function handleSetTitle(e: React.ChangeEvent<HTMLInputElement>, marker: MarkerType){
    const { value } = e.target as HTMLInputElement;

    const updatedMarker  = { ...marker, title: value };
    setTemporaryModalMarker(updatedMarker);
  }

  function handleSetPhotoText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, markerPhoto: MarkerPhotoType, markerPhotoIndex: number){
    if(!temporaryModalMarker) return;

    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    const updatedPhoto: MarkerPhotoType = { ...markerPhoto, [name === 'pic-label' ? 'label' : 'comment']: value };

    setTemporaryModalMarker(prev => {
      if(!prev) return prev;

      const updatedPhotos = [...prev.photos];
      updatedPhotos[markerPhotoIndex] = updatedPhoto;

      return { ...prev, photos: updatedPhotos };
    });
    
  }

  async function handleDeleteMarker(marker: MarkerType){
    // Appel API pour supprimer le marqueur de la BDD
    if(!marker.id) return;
    
    const response = await deleteMarker(marker.id);
    if(!response.ok){
      console.error("Erreur lors de la suppression du marqueur :", response.statusText);
      return;
    } else {
      setMarkers(prevMarkers => prevMarkers.filter(m => m.id !== marker.id));
      setIsModalActive(false);
    }
  }

  useEffect(() => {
    async function fetchLastOpenedPlan() {
      if(!currentFileUrl){
        const response = await getLastOpenedPlan(projectId);
        if(response.ok){
          const result = await response.json();
          const lastPlan = result.lastPlan;
          if(lastPlan) {
            const isActuallyPdf = lastPlan.documentStorageKey.toLowerCase().endsWith('.pdf');
            displayPlan(lastPlan.id, lastPlan.name, lastPlan.documentStorageKey, lastPlan.temporaryAccessUrl, isActuallyPdf);
          }
        } else {
          console.error("Erreur lors de la récupération du dernier plan ouvert :", response.statusText);
        }
      }
    }

    async function fetchMarkersForCurrentPlan() {
      const response = await getMarkers(currentPlan?.id as string);
      if(response.ok){
        const result = await response.json();
        const fetchedMarkers = result.markers;
        console.log("Marqueurs récupérés :", fetchedMarkers);
        setMarkers(fetchedMarkers);
      } else {
        console.error("Erreur lors de la récupération des marqueurs :", response.statusText);
      }
    }

    fetchLastOpenedPlan();
    fetchMarkersForCurrentPlan();
  }, [currentFileUrl])

  
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
                        style={{ left: `${marker.coordX}%`, top: `${marker.coordY}%` }}
                        onClick={(e) => handleMarkerClick(e, marker)}
                      >
                        {index + 1}
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
        marker={temporaryModalMarker}
        handleSetTitle={handleSetTitle}
        handleSetPhotoText={handleSetPhotoText}
        handleAddMarker={handleAddMarker}
        handleUpdateMarkerPhoto={updateMarkerPhoto}
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