'use client';
import { MarkerPhotoType } from '@/types/project'
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
      <div className="flex items-center justify-center mt-4 gap-10">
        <div className="bg-primary rounded-full p-1 text-white hover:bg-primary-hover cursor-pointer" onClick={() => {setIndex(prev => prev > 0 ? prev - 1 : maxPhotoIndex)}}>
          <ArrowLeft className="w-6 h-6" />
        </div>
        <ul className="flex items-center gap-1">
          {markerPhotos.map((_, index) => (
            <li key={index} className={`h-3 w-3 rounded-full ${index === currentPhotoIndex ? 'bg-primary' : 'bg-gray-300'} cursor-pointer`} onClick={() => setIndex(index)}></li>
          ))}
        </ul>
        <div className="bg-primary rounded-full p-1 text-white hover:bg-primary-hover cursor-pointer" onClick={() => {setIndex(prev => prev < maxPhotoIndex ? prev + 1 : 0)}}>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default MarkerPicsCarousel