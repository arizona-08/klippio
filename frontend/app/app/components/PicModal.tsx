'use client'
import React from 'react'

interface PicModalInterface{
  isActive: boolean
  imgSrc: string | ArrayBuffer | null
  handleClose: () => void;
}

function PicModal({isActive, imgSrc, handleClose}: PicModalInterface) {
  return (
    <>
      {isActive && (  
        <div id="photo-modal" className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl max-h-full overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Photo du chantier</h3>
              <button id="close-modal-btn" className="text-gray-500 hover:text-gray-800 text-3xl" onClick={handleClose}>&times;</button>
            </div>
            <div className="p-4">
              <img id="modal-image" src={imgSrc as string | undefined} alt="Photo de chantier" className="w-full h-auto rounded"/>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PicModal