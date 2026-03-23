'use client';
import { MarkerPhotoType } from '@/types/project'
import React from 'react'

interface MarkerPicsCarouselProps {
  markerPhotos: MarkerPhotoType[]
  currentPhotoIndex: number
  maxPhotoIndex: number
  setIndex: React.Dispatch<React.SetStateAction<number>>
}

function MarkerPicsCarousel({ markerPhotos, currentPhotoIndex, maxPhotoIndex, setIndex }: MarkerPicsCarouselProps) {
  return (
    <div>

      {/* Index tracker */}
      <div className="flex items-center justify-center mt-4">
        <ul className="flex items-center gap-1">
          {markerPhotos.map((_, index) => (
            <li key={index} className={`h-3 w-3 rounded-full ${index === currentPhotoIndex ? 'bg-primary' : 'bg-gray-300'} cursor-pointer`} onClick={() => setIndex(index)}></li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default MarkerPicsCarousel