'use client'
import { MarkerPhotoType, MarkerType } from '@/types/project';
import React from 'react'
import Image from 'next/image';
import MarkerPicsCarousel from './MarkerPicsCarousel';
import { Camera, File, Flag, ImagePlus, Trash2, X } from 'lucide-react';
import { reportMarkerPhoto } from '@/proxy/markers/marker-functions';
import { CameraCapture } from './CameraCapture';
import CTA from '../../atoms/CTA';

interface PicModalInterface {
  isActive: boolean;
  marker: MarkerType | undefined;
  handleClose: () => void;
  handleSetTitle: (e: React.ChangeEvent<HTMLInputElement>, marker: MarkerType) => void;
  handleSetPhotoText: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, markerPhoto: MarkerPhotoType, markerPhotoIndex: number) => void;
  handleSetPhotos: (photos: MarkerPhotoType[]) => void;
  handleAddMarker: (marker: MarkerType) => void;
  handleUpdateMarkerPhoto: (marker: MarkerType) => void;
  handleDeleteMarker: (marker: MarkerType) => void;
  canEdit: boolean;
}

function PicModal({ isActive, marker, handleClose, handleSetTitle, handleSetPhotoText, handleSetPhotos, handleAddMarker, handleUpdateMarkerPhoto, handleDeleteMarker, canEdit }: PicModalInterface) {
  const revokePreviewUrls = React.useCallback((photos: MarkerPhotoType[]) => {
    photos.forEach((photo) => {
      const previewUrl = photo.previewUrl as string | undefined;
      if (typeof previewUrl === 'string' && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    });
  }, []);

  // Au début du composant
  const [localPhotos, setLocalPhotos] = React.useState<MarkerPhotoType[]>(marker?.photos || []);
  const isLocalPhotosEmpty = localPhotos.length === 0;
  const isOnlyOneLocalPhoto = localPhotos.length === 1;
  const [isPhotoSelectorVisible, setIsPhotoSelectorVisible] = React.useState(false);
  const [reportMessage, setReportMessage] = React.useState('');
  const [isReporting, setIsReporting] = React.useState(false);
  const previousLocalPhotosRef = React.useRef<MarkerPhotoType[]>(localPhotos);
  const lastMarkerIdRef = React.useRef<string | undefined>(marker?.id);

  // On synchronise localPhotos quand le marqueur change (ex: ouverture de la modale)
  React.useEffect(() => {
    if (marker?.photos) {
      setLocalPhotos([...marker.photos]);
      setReportMessage('');
      if (marker.id !== lastMarkerIdRef.current) {
        setCurrentMarkerPhotoIndex(0);
        lastMarkerIdRef.current = marker.id;
      }
      return;
    }

    setLocalPhotos([]);
    setCurrentMarkerPhotoIndex(0);
    lastMarkerIdRef.current = undefined;
  }, [marker]);

  React.useEffect(() => {
    const previousPhotos = previousLocalPhotosRef.current;
    const removedPhotos = previousPhotos.filter(
      (photo) => !localPhotos.some((nextPhoto) => nextPhoto.previewUrl === photo.previewUrl)
    );

    revokePreviewUrls(removedPhotos);
    previousLocalPhotosRef.current = localPhotos;
  }, [localPhotos, revokePreviewUrls]);

  React.useEffect(() => {
    return () => {
      revokePreviewUrls(previousLocalPhotosRef.current);
    };
  }, [revokePreviewUrls]);

  const [currentMarkerPhotoIndex, setCurrentMarkerPhotoIndex] = React.useState(0);
  const maxPhotoIndex = localPhotos.length ? localPhotos.length - 1 : 0;
  const currentPhoto = localPhotos[currentMarkerPhotoIndex];
  const currentPhotoSrc = currentPhoto?.previewUrl || currentPhoto?.temporaryAccessUrl;

  const addMorePhotosInputRef = React.useRef<HTMLInputElement>(null);

  function handleAddMorePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files).map((file) => ({
      label: '',
      comment: '',
      previewUrl: URL.createObjectURL(file),
      physicalFile: file,
    }));

    if (newPhotos.length) {
      const nextPhotos = [...localPhotos, ...newPhotos];
      setLocalPhotos(nextPhotos);
      handleSetPhotos(nextPhotos);
      setCurrentMarkerPhotoIndex(nextPhotos.length - 1);

      if (!addMorePhotosInputRef.current) return;
      addMorePhotosInputRef.current.value = '';
    }
  }

 function handleDeleteMarkerPhoto(photoIndex: number) {
    // 1. On crée une copie sans l'élément supprimé
    const updatedPhotos = localPhotos.filter((_, index) => index !== photoIndex);
    
    // 2. On met à jour l'état LOCAL (le SAS)
    setLocalPhotos(updatedPhotos);
    handleSetPhotos(updatedPhotos);

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

    const nextPhotos = [...localPhotos, newPhoto];
    setLocalPhotos(nextPhotos);
    handleSetPhotos(nextPhotos);
    setCurrentMarkerPhotoIndex(nextPhotos.length - 1);
  }

  async function handleReportPhoto() {
    if (!currentPhoto?.id) return;
    setIsReporting(true);
    const response = await reportMarkerPhoto(currentPhoto.id);
    setReportMessage(response.ok ? 'Photo signalée à l’administration.' : 'Cette photo a déjà été signalée ou une erreur est survenue.');
    setIsReporting(false);
  }

  return (
    <>
      <CameraCapture isVisible={isCameraCaptureVisible} onPhotoCaptured={handlePhotoCaptured} onClose={closeCameraCapture} />

      {isActive && (  
        <div id="photo-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm transition-opacity duration-300" role="dialog" aria-modal="true" aria-labelledby="marker-modal-title">
          
          {/* CONTENEUR PRINCIPAL : flex, flex-col, overflow-hidden et max-h-[90vh] pour forcer la limite de taille */}
          <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            
            {/* EN-TÊTE : flex-none pour empêcher l'écrasement, plus besoin de sticky */}
            <div className="flex w-full flex-none items-center gap-4 border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><ImagePlus className="h-4 w-4" /></span>
              <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">Observation</p>
                <input
                  id="marker-modal-title"
                  type="text"
                  name='pic-title'
                  placeholder='Titre du marqueur...'
                  value={marker?.title || ''} 
                  onChange={(e) => handleSetTitle(e, marker as MarkerType)}
                  readOnly={!canEdit}
                  className='w-full truncate rounded-md border border-transparent bg-transparent py-1 text-lg font-semibold outline-none transition-colors hover:bg-gray-50 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10'
                />
              </div>
              <button id="close-modal-btn" type="button" aria-label="Fermer la fiche" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900" onClick={handleClose}><X className="h-5 w-5" /></button>
            </div>

            {/* ZONE DU MILIEU : flex-1 pour prendre l'espace libre, et overflow-y-auto pour le défilement */}
            <div className='flex-1 overflow-y-auto bg-[#f7faf8]'>
              
              {/* ZONE IMAGE ET CARROUSEL */}
              <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
                <section className="min-w-0 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 sm:p-4">
                  <div className="relative h-[280px] overflow-hidden rounded-xl bg-gray-100 sm:h-[420px]">
                    {currentPhotoSrc ? <Image id="modal-image" src={currentPhotoSrc as string} alt={localPhotos[currentMarkerPhotoIndex]?.label || 'Photo de chantier'} fill unoptimized className="object-cover" sizes="(max-width: 1024px) 100vw, 58vw" /> : <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">Ajoutez une photo à cette observation</div>}
                    {localPhotos.length > 0 && <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">{currentMarkerPhotoIndex + 1} / {localPhotos.length}</span>}
                  </div>
                  <div className="mt-3"><MarkerPicsCarousel markerPhotos={localPhotos} currentPhotoIndex={currentMarkerPhotoIndex} maxPhotoIndex={maxPhotoIndex} setIndex={setCurrentMarkerPhotoIndex} /></div>
                  <div className="mt-3 flex items-center justify-between gap-3"><div>{currentPhoto?.id && <button type="button" onClick={handleReportPhoto} disabled={isReporting} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Flag className="h-3.5 w-3.5" />{isReporting ? 'Signalement…' : 'Signaler cette photo'}</button>}{reportMessage && <p className="mt-1 text-xs font-medium text-primary">{reportMessage}</p>}</div>{canEdit && <button type="button" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={isLocalPhotosEmpty || isOnlyOneLocalPhoto} onClick={() => handleDeleteMarkerPhoto(currentMarkerPhotoIndex)}><Trash2 className="h-3.5 w-3.5" />Supprimer cette photo</button>}</div>
                </section>

                <section className="space-y-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 sm:p-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Détails de l&apos;observation</h4>
                    <p className="mt-1 text-xs leading-5 text-gray-500">Ajoutez le contexte nécessaire pour permettre à l&apos;équipe d&apos;agir rapidement.</p>
                  </div>
                  <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Label de la photo</label>
                  <input
                    type="text"
                    name='pic-label'
                    placeholder='Ajouter un label précis...'
                    value={localPhotos[currentMarkerPhotoIndex]?.label || ''} 
                    onChange={(e) => handleSetPhotoText(e, localPhotos[currentMarkerPhotoIndex] as MarkerPhotoType, currentMarkerPhotoIndex)}
                    readOnly={!canEdit}
                    className='w-full rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 read-only:bg-gray-50'
                  />
                </div>

                  <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Commentaire</label>
                  <textarea
                    name="pic-comment"
                    id="pic-comment"
                    rows={4}
                    placeholder='Observations ou détails...'
                    className='w-full resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 read-only:bg-gray-50'
                    value={localPhotos[currentMarkerPhotoIndex]?.comment || ''} 
                    onChange={(e) => handleSetPhotoText(e, localPhotos[currentMarkerPhotoIndex] as MarkerPhotoType, currentMarkerPhotoIndex)}
                    readOnly={!canEdit}
                  ></textarea>
                  </div>
                </section>
              </div>
            </div>

            {/* ZONE D'ACTIONS : flex-none, plus besoin de sticky */}
            <div id="actions" className={`flex w-full flex-none flex-col-reverse items-stretch justify-between gap-4 border-t border-gray-100 bg-white px-5 py-4 md:flex-row md:items-center sm:px-6 ${canEdit ? '' : 'hidden'}`}>
              {canEdit && <CTA
                type="button" 
                color="danger" 
                text="Supprimer le marqueur" 
                onClick={() => handleDeleteMarker(marker as MarkerType)}
              />}
              {canEdit && <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative">
                  <div className={`photo-selector absolute bottom-full left-0 mb-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ${isPhotoSelectorVisible ? 'block' : 'hidden'}`}>
                    <button
                      className="flex w-full items-center gap-3 p-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setIsCameraCaptureVisible(true);
                        setIsPhotoSelectorVisible(false);
                      }}
                    >
                      <Camera className="w-5 h-5" /> Prendre une photo
                    </button>

                    <hr className="border-gray-100"/>

                    <button
                      className="flex w-full items-center gap-3 p-3 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        addMorePhotosInputRef.current?.click()
                        setIsPhotoSelectorVisible(false);
                      }}
                    >
                      <File className="w-5 h-5" /> Choisir depuis l&apos;appareil
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
                  disabled={isLocalPhotosEmpty}
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
              </div>}
            </div>
          </div>

          <input 
            type="file"
            name="photo-upload"
            id="photo-upload"
            className="hidden"
            accept="image/*"
            multiple
            capture="environment"
            ref={addMorePhotosInputRef}
            onChange={(e) => handleAddMorePhotos(e)}
          />
        </div>
      )}
    </>
  )
}

export default PicModal
