'use client'
import { MarkerPhotoType, MarkerType } from '@/types/project';
import React from 'react'
import Image from 'next/image';
import MarkerPicsCarousel from './MarkerPicsCarousel';
import { CTA } from '@repo/ui';
import { Camera } from 'lucide-react';
import { CameraCapture } from './CameraCapture';

interface PicModalInterface {
  isActive: boolean;
  marker: MarkerType | undefined;
  handleClose: () => void;
  handleSetTitle: (e: React.ChangeEvent<HTMLInputElement>, marker: MarkerType) => void;
  handleSetPhotoText: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, markerPhoto: MarkerPhotoType, markerPhotoIndex: number) => void;
  handleAddMarker: (marker: MarkerType) => void;
  handleUpdateMarkerPhoto: (marker: MarkerType) => void;
  handleDeleteMarker: (marker: MarkerType) => void;
}

function PicModal({ isActive, marker, handleClose, handleSetTitle, handleSetPhotoText, handleAddMarker, handleUpdateMarkerPhoto, handleDeleteMarker }: PicModalInterface) {
  // Au début du composant
  const [localPhotos, setLocalPhotos] = React.useState<MarkerPhotoType[]>(marker?.photos || []);
  const isOnlyOneLocalPhoto = localPhotos.length === 1;
  const [isPhotoSelectorVisible, setIsPhotoSelectorVisible] = React.useState(false);

  // On synchronise localPhotos quand le marqueur change (ex: ouverture de la modale)
  React.useEffect(() => {
    if (marker?.photos) {
      setLocalPhotos([...marker.photos]);
    }
  }, [marker]);

  const [currentMarkerPhotoIndex, setCurrentMarkerPhotoIndex] = React.useState(0);
  const maxPhotoIndex = localPhotos.length ? localPhotos.length - 1 : 0;

  const addMorePhotosInputRef = React.useRef<HTMLInputElement>(null);

  function handleAddMorePhotos(e: React.ChangeEvent<HTMLInputElement>, currentMarker: MarkerType) {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;

        const newPhoto: MarkerPhotoType = {
          label: '',
          comment: '',
          previewUrl: e.target.result as string,
          physicalFile: file
        };

        setLocalPhotos(prev => [...prev, newPhoto]);
        setCurrentMarkerPhotoIndex(localPhotos.length);
      };

      reader.readAsDataURL(file);

      if (!addMorePhotosInputRef.current) return;
      addMorePhotosInputRef.current.value = '';
    }
  }

 function handleDeleteMarkerPhoto(photoIndex: number) {
    // 1. On crée une copie sans l'élément supprimé
    const updatedPhotos = localPhotos.filter((_, index) => index !== photoIndex);
    
    // 2. On met à jour l'état LOCAL (le SAS)
    setLocalPhotos(updatedPhotos);

    // 3. Gestion de l'index du carrousel
    if (currentMarkerPhotoIndex >= updatedPhotos.length) {
      setCurrentMarkerPhotoIndex(Math.max(0, updatedPhotos.length - 1));
    }
  }

  React.useEffect(() => {
    function handleClickOutsidePhotoSelector(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.photo-selector')) {
        setIsPhotoSelectorVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutsidePhotoSelector);
    return () => document.removeEventListener('mousedown', handleClickOutsidePhotoSelector);
  }, []);



  const [isCameraCaptureVisible, setIsCameraCaptureVisible] = React.useState(false);

  function closeCameraCapture() {
    setIsCameraCaptureVisible(false);
  }

  async function handlePhotoCaptured(file: File, previewUrl: string) {
    const newPhoto: MarkerPhotoType = {
      label: '',
      comment: '',
      previewUrl,
      physicalFile: file
    };

    setLocalPhotos(prev => [...prev, newPhoto]);
    setCurrentMarkerPhotoIndex(localPhotos.length);
  }

  return (
    <>
      <CameraCapture isVisible={isCameraCaptureVisible} onPhotoCaptured={handlePhotoCaptured} onClose={closeCameraCapture} />

      {isActive && (  
        <div id="photo-modal" className="fixed inset-0 bg-black/55 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          
          {/* CONTENEUR PRINCIPAL : flex, flex-col, overflow-hidden et max-h-[90vh] pour forcer la limite de taille */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden transform transition-transform duration-300 scale-100">
            
            {/* EN-TÊTE : flex-none pour empêcher l'écrasement, plus besoin de sticky */}
            <div className="flex-none w-full flex justify-between items-center gap-6 p-6 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-semibold flex-grow">
                <input
                  type="text"
                  name='pic-title'
                  placeholder='Titre du marqueur...'
                  value={marker?.title || ''} 
                  onChange={(e) => handleSetTitle(e, marker as MarkerType)}
                  className='w-full p-2 outline-none bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-gray-200 rounded-md transition-colors'
                />
              </h3>
              <button id="close-modal-btn" className="text-gray-400 hover:text-gray-900 text-3xl transition-colors p-1 rounded-full hover:bg-gray-100" onClick={handleClose}>&times;</button>
            </div>

            {/* ZONE DU MILIEU : flex-1 pour prendre l'espace libre, et overflow-y-auto pour le défilement */}
            <div className='flex-1 overflow-y-auto'>
              
              {/* ZONE IMAGE ET CARROUSEL */}
              <div className="p-6 pb-2">
                <div className="relative w-full h-[400px] border-4 border-white shadow-lg rounded-xl overflow-hidden bg-gray-50">
                  <Image 
                    id="modal-image"
                    src={localPhotos[currentMarkerPhotoIndex]?.previewUrl as string || localPhotos[currentMarkerPhotoIndex]?.temporaryAccessUrl as string}
                    alt="Photo de chantier"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="mt-4">
                  <MarkerPicsCarousel
                    markerPhotos={localPhotos}
                    currentPhotoIndex={currentMarkerPhotoIndex}
                    maxPhotoIndex={maxPhotoIndex}
                    setIndex={setCurrentMarkerPhotoIndex}
                  />
                </div>
              </div>

              {/* ZONE DE SAISIE DE DONNÉES */}
              <div className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Label de la photo</label>
                  <input
                    type="text"
                    name='pic-label'
                    placeholder='Ajouter un label précis...'
                    value={localPhotos[currentMarkerPhotoIndex]?.label || ''} 
                    onChange={(e) => handleSetPhotoText(e, localPhotos[currentMarkerPhotoIndex] as MarkerPhotoType, currentMarkerPhotoIndex)}
                    className='w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary'
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Commentaire</label>
                  <textarea
                    name="pic-comment"
                    id="pic-comment"
                    rows={4}
                    placeholder='Observations ou détails...'
                    className='w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary'
                    value={localPhotos[currentMarkerPhotoIndex]?.comment || ''} 
                    onChange={(e) => handleSetPhotoText(e, localPhotos[currentMarkerPhotoIndex] as MarkerPhotoType, currentMarkerPhotoIndex)}
                  ></textarea>
                </div>
              </div>

              <div className="px-6 my-5">
                <CTA
                  type='button'
                  color='danger_reverse'
                  text='Supprimer la photo'
                  onClick={() => handleDeleteMarkerPhoto(currentMarkerPhotoIndex)}
                />
              </div>
            </div>

            {/* ZONE D'ACTIONS : flex-none, plus besoin de sticky */}
            <div id="actions" className="flex-none w-full flex flex-col-reverse justify-between items-stretch md:flex-row md:items-center p-6 border-t border-gray-100 bg-gray-50 gap-6">
              <CTA 
                type="button" 
                color="danger" 
                text="Supprimer le marqueur" 
                onClick={() => handleDeleteMarker(marker as MarkerType)}
              />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:grow md:justify-end">
                <div className="relative">
                  <div className={`photo-selector absolute -top-2 -translate-y-full mb-5 left-0 bg-white border border-gray-200 rounded-md ${isPhotoSelectorVisible ? 'block' : 'hidden'}`}>
                    <button
                      className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsCameraCaptureVisible(true)}
                    >
                      <Camera className="w-5 h-5" /> Prendre une photo
                    </button>

                    <hr className="text-gray-200"/>

                    <button
                      className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        addMorePhotosInputRef.current?.click()
                        setIsPhotoSelectorVisible(false);
                      }}
                    >
                      <Camera className="w-5 h-5" /> Choisir depuis l'appareil
                    </button>
                  </div>
                  <CTA 
                    type='button' 
                    color='secondary' 
                    text="Ajouter plus de photos" 
                    onClick={() => setIsPhotoSelectorVisible(prev => !prev)}
                  />
                </div>
                <CTA 
                  type="button" 
                  color="primary" 
                  text="Valider les modifications"
                  disabled={isOnlyOneLocalPhoto}
                  onClick={() => {
                    if (marker) {
                      // On fusionne le marqueur original avec nos photos modifiées dans le SAS
                      const updatedMarker = { ...marker, photos: localPhotos };
                      
                      if (marker.id) {
                        handleUpdateMarkerPhoto(updatedMarker);
                      } else {
                        handleAddMarker(updatedMarker);
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <input 
            type="file"
            name="photo-upload"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            capture="environment"
            ref={addMorePhotosInputRef}
            onChange={(e) => handleAddMorePhotos(e, marker as MarkerType)}
          />
        </div>
      )}
    </>
  )
}

export default PicModal