'use client'
import { MarkerPhotoType, MarkerType } from '@/types/project';
import React from 'react'
import MarkerPicsCarousel from './MarkerPicsCarousel';
import { CTA } from '@repo/ui';

interface PicModalInterface{
  isActive: boolean
  marker: MarkerType | undefined
  handleClose: () => void;
  handleSetTitle: (e: React.ChangeEvent<HTMLInputElement>, marker: MarkerType) => void;
  handleSetPhotoText: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, markerPhoto: MarkerPhotoType, markerPhotoIndex: number) => void;
  handleDeleteMarker: (marker: MarkerType) => void;
}

function PicModal({isActive, marker, handleClose, handleSetTitle, handleSetPhotoText, handleDeleteMarker}: PicModalInterface) {
  const [currentMarkerPhotoIndex, setCurrentMarkerPhotoIndex] = React.useState(0);
  const [maxPhotoIndex, setMaxPhotoIndex] = React.useState(marker?.photos.length ? marker.photos.length - 1 : 0);

  const addMorePhotosInputRef = React.useRef<HTMLInputElement>(null);

  function handleAddMorePhotos(e: React.ChangeEvent<HTMLInputElement>, marker: MarkerType) {
    const files = e.target.files
    if(!files) return

    const file = files[0]

    if(file){
      const reader = new FileReader();
      reader.onload = (e) => {
        if(!e.target) return;

        const newPhoto: MarkerPhotoType = {
          label: '',
          comment: '',
          photoUrl: e.target.result as string
        }

        marker.photos.push(newPhoto);
        setMaxPhotoIndex(prev => prev + 1);
        setCurrentMarkerPhotoIndex(marker.photos.length - 1);
      }

      reader.readAsDataURL(file);

      // Réinitialiser l'input pour permettre de charger la même photo plusieurs fois
      if(!addMorePhotosInputRef.current) return
      addMorePhotosInputRef.current.value = '';
    }
  }
  return (
    <>
      {isActive && (  
        <div id="photo-modal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                <input
                  type="text"
                  name='pic-title'
                  placeholder='Ajouter un titre'
                  value={marker?.title || ''} 
                  onChange={(e) => handleSetTitle(e, marker as MarkerType)}
                />
              </h3>
              <button id="close-modal-btn" className="text-gray-500 hover:text-gray-800 text-3xl" onClick={handleClose}>&times;</button>
            </div>
            <div className="p-4">
              <img id="modal-image" src={marker?.photos[currentMarkerPhotoIndex]?.photoUrl as string} alt="Photo de chantier" className="w-full h-auto rounded"/>
              <MarkerPicsCarousel markerPhotos={marker?.photos || []} currentPhotoIndex={currentMarkerPhotoIndex} maxPhotoIndex={maxPhotoIndex} setIndex={setCurrentMarkerPhotoIndex} />
            </div>

            <div className="p-4">
              <input
                type="text"
                name='pic-label'
                placeholder='Ajouter un label'
                value={marker?.photos[currentMarkerPhotoIndex]?.label || ''} 
                onChange={(e) => handleSetPhotoText(e, marker?.photos[currentMarkerPhotoIndex] as MarkerPhotoType, currentMarkerPhotoIndex)}
                className='w-full p-2 border rounded'
              />
            </div>

            <div className="p-4">
              <textarea
                name="pic-comment"
                id="pic-comment"
                cols={30}
                rows={4}
                placeholder='Ajouter un commentaire'
                className='w-full p-2 border rounded'
                value={marker?.photos[currentMarkerPhotoIndex]?.comment || ''} 
                onChange={(e) => handleSetPhotoText(e, marker?.photos[currentMarkerPhotoIndex] as MarkerPhotoType, currentMarkerPhotoIndex)}
              ></textarea>
            </div>
            <div id="actions" className="flex justify-between p-4 border-t gap-8">
              <button className='px-4 py-2 bg-red-500 text-white font-medium rounded-md cursor-pointer' onClick={() => handleDeleteMarker(marker as MarkerType)}>Supprimer</button>
              <div className="flex items-center gap-4">
                <CTA type='button' color='secondary' text="Ajouter plus de photos" onClick={() => addMorePhotosInputRef.current?.click()}/>
                <button className='px-4 py-2 bg-green-500 text-white font-medium rounded-md cursor-pointer' onClick={handleClose}>Valider</button>
              </div>
            </div>
          </div>

          <input 
            type="file"
            name=""
            id=""
            className="hidden"
            ref={addMorePhotosInputRef}
            onChange={(e) => handleAddMorePhotos(e, marker as MarkerType)}
          />
        </div>
      )}
    </>
  )
}

export default PicModal