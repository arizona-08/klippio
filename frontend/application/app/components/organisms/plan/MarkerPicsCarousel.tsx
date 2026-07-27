'use client';

import { MarkerPhotoType } from '@/types/project';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface MarkerPicsCarouselProps {
  markerPhotos: MarkerPhotoType[];
  currentPhotoIndex: number;
  maxPhotoIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}

function MarkerPicsCarousel({ markerPhotos, currentPhotoIndex, maxPhotoIndex, setIndex }: MarkerPicsCarouselProps) {
  if (!markerPhotos.length) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 px-4 py-5 text-sm text-gray-500">
        <ImageOff className="h-4 w-4" /> Aucune photo ajoutée
      </div>
    );
  }

  const goToPrevious = () => setIndex((index) => (index > 0 ? index - 1 : maxPhotoIndex));
  const goToNext = () => setIndex((index) => (index < maxPhotoIndex ? index + 1 : 0));

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={goToPrevious} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/30 hover:text-primary" aria-label="Photo précédente">
        <ChevronLeft className="h-4 w-4" />
      </button>
      <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
        {markerPhotos.map((photo, index) => {
          const source = typeof photo.previewUrl === 'string'
            ? photo.previewUrl
            : photo.temporaryAccessUrl;
          const isCurrent = index === currentPhotoIndex;

          return (
            <button
              key={photo.id || source || index}
              type="button"
              onClick={() => setIndex(index)}
              className={`relative h-14 w-18 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${isCurrent ? 'border-primary shadow-sm' : 'border-transparent opacity-70 hover:border-gray-300 hover:opacity-100'}`}
              aria-label={`Afficher la photo ${index + 1}`}
              aria-pressed={isCurrent}
            >
              {source ? <Image src={source} alt={`Miniature de la photo ${index + 1}`} fill unoptimized sizes="72px" className="object-cover" /> : <span className="flex h-full items-center justify-center bg-gray-100 text-xs text-gray-400">{index + 1}</span>}
              {isCurrent && <span className="absolute inset-x-0 bottom-0 bg-primary/90 py-0.5 text-[10px] font-semibold text-white">{index + 1}</span>}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={goToNext} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-primary/30 hover:text-primary" aria-label="Photo suivante">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default MarkerPicsCarousel;
