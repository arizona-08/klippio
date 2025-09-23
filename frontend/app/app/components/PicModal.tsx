'use client'
import React from 'react'
import { MarkerType } from './PlanLoader';

interface PicModalInterface{
  isActive: boolean
  marker: MarkerType | undefined
  handleClose: () => void;
  handleSetText: (e: React.ChangeEvent, marker: MarkerType) => void;
}

function PicModal({isActive, marker, handleClose, handleSetText}: PicModalInterface) {
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
                  onChange={(e) => handleSetText(e, marker as MarkerType)}
                />
              </h3>
              <button id="close-modal-btn" className="text-gray-500 hover:text-gray-800 text-3xl" onClick={handleClose}>&times;</button>
            </div>
            <div className="p-4">
              <img id="modal-image" src={marker?.photoUrl as string} alt="Photo de chantier" className="w-full h-auto rounded"/>
            </div>
            <div className="p-4">
              <textarea
                name="pic-comment"
                id="pic-comment"
                cols={30}
                rows={4}
                placeholder='Ajouter un commentaire'
                className='w-full p-2 border rounded'
                value={marker?.comment || ''} 
                onChange={(e) => handleSetText(e, marker as MarkerType)}
              ></textarea>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PicModal