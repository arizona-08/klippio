import Image from 'next/image';
import React, { useEffect, useMemo, useState } from 'react'

interface PicturePreviewProps {
  type: 'PROFILE' | 'BANNER';
  file: File | string | undefined;
  isVisible: boolean;
  onClose: () => void;
  onConfirm: (data: { zoom: number; offsetX: number; offsetY: number }, type: 'PROFILE' | 'BANNER') => void;
}
function PicturePreview({ type, file, isVisible, onClose, onConfirm }: PicturePreviewProps) {
  const [zoom, setZoom] = useState(1.2)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)

  const imageUrl = useMemo(() => {
    if (!file) {
      return null
    }
    if (typeof file === 'string') {
      return file
    }
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    setZoom(1.2)
    setOffsetX(0)
    setOffsetY(0)
  }, [file])

  useEffect(() => {
    if (!imageUrl) {
      return
    }
    return () => {
      URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault()
    setIsDragging(true)
    setDragStart({ x: event.clientX, y: event.clientY })
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging || !dragStart) {
      return
    }
    const deltaX = event.clientX - dragStart.x
    const deltaY = event.clientY - dragStart.y
    setDragStart({ x: event.clientX, y: event.clientY })
    setOffsetX((prev) => prev + deltaX)
    setOffsetY((prev) => prev + deltaY)
  }

  function handlePointerUp() {
    setIsDragging(false)
    setDragStart(null)
  }

  if (!isVisible) {
    return null;
  }

  return (
    <>
      <div className="dark-layer fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Apercu de la photo</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 hover:border-gray-300"
            >
              Fermer
            </button>
          </div>

          <div className="mt-5 flex flex-col items-center gap-4">
            <div
              className={`relative overflow-hidden  border border-gray-200 bg-gray-100 ${type === 'BANNER' ? 'h-40 w-full rounded-lg' : 'h-60 w-60 rounded-full'}`}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={type === 'BANNER' ? "Apercu de la photo de banniere" : "Apercu de la photo de profil"}
                  width={type === 'BANNER' ? 600 : 240}
                  height={type === 'BANNER' ? 400 : 240}
                  sizes="100vw"
                  className="absolute left-1/2 top-1/2 select-none"
                  unoptimized
                  style={{transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px) scale(${zoom})` }}
                  draggable={false}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
                  Aucun fichier selectionne
                </div>
              )}
            </div>

            <div className="w-full">
              <label className="text-sm font-medium text-gray-700">Zoom</label>
              <input
                type="range"
                min={1}
                max={2}
                step={0.10}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="mt-2 w-full accent-emerald-600"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm?.({ zoom, offsetX, offsetY }, type)
                onClose()
              }}
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Utiliser cette photo
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default PicturePreview