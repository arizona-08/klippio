'use client'
import React from 'react'
import PicModal from './PicModal'

export type MarkerType = {
  id: number,
  x: number,
  y: number,
  title: string,
  comment: string
  photoUrl: string | ArrayBuffer | null
}

function PlanLoader() {

  const [markers, setMarkers] = React.useState<MarkerType[]>([]);
  const currentClickCoords = React.useRef({x: 0, y: 0})
  const [nextMarkerId, setNextMarkerId] = React.useState<number>(1);
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false)
  const [modalCurrentMarker, setModalCurrentMarker] = React.useState<MarkerType | undefined>(undefined)

  const planSectionRef = React.useRef<HTMLDivElement | null>(null);
  const planContainerRef = React.useRef<HTMLDivElement | null>(null)
  const photoInputRef = React.useRef<HTMLInputElement | null>(null)

  function uploadPlan(event: React.ChangeEvent<HTMLInputElement>){
    const files = event.target.files

    if(!files) return

    const file = files[0]
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if(!planContainerRef.current || !planSectionRef.current || !e.target) return 

          planContainerRef.current.style.backgroundImage = `url('${e.target.result}')`;
          planSectionRef.current.classList.remove('hidden');
          // Réinitialiser les anciens repères si un nouveau plan est chargé
          setMarkers([]);
          setNextMarkerId(1);
        };
        reader.readAsDataURL(file);
    }
  }

  function handlePlanClick(event: React.MouseEvent){
    if (event.currentTarget.classList.contains('marker')) {
      return;
    }

    if(!planContainerRef.current || !photoInputRef.current) return

    const rect = planContainerRef.current.getBoundingClientRect();
    // Calcule les coordonnées en pourcentage pour la responsivité
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    currentClickCoords.current = {x, y};
    
    // Déclenche l'input de fichier photo
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

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label htmlFor="plan-upload" className="block text-lg font-medium mb-2">1. Chargez votre plan de chantier</label>
        <input
          type="file"
          id="plan-upload"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          onChange={uploadPlan}
        />
      </div>

      {/* Container qui va accueillir le plan */}
      <div id="plan-section" className="bg-white p-4 rounded-lg shadow-md hidden" ref={planSectionRef}>
        <h2 className="text-lg font-medium mb-4">2. Cliquez sur le plan pour ajouter un repère photo</h2>
        <div
          id="plan-container"
          className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 pb-[75%] bg-contain bg-center bg-no-repeat relative"
          ref={planContainerRef}
          onClick={handlePlanClick}
        >
          {markers.map((marker) => (
            <div
              key={marker.id}
              className="marker absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              onClick={(e) => handleMarkerClick(e, marker)}
            >
              {marker.id}
            </div>
          ))}
        </div>
      </div>

      {/* Input caché pour le chargement des photos */}
      <input
        type="file"
        id="photo-input"
        accept="image/*"
        className='hidden'
        ref={photoInputRef}
        onChange={chooseMarkerPic}
      />

      <PicModal isActive={isModalActive} marker={modalCurrentMarker} handleSetText={handleSetText} handleClose={handleCloseModal}/>
    </>
  )
}

export default PlanLoader