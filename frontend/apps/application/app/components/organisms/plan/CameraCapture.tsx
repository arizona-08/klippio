'use client';
import React, { useRef, useState } from 'react';
import { CTA } from '@repo/ui';

interface CameraCaptureProps {
  isVisible: boolean;
  onPhotoCaptured: (file: File, previewUrl: string) => void;
  onClose: () => void;
}

export function CameraCapture({ isVisible, onPhotoCaptured, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 1. Demander la permission et démarrer le flux vidéo
  const startCamera = async () => {
    setError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Caméra arrière sur mobile
        audio: false, // Pas besoin de micro pour une photo
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra :", err);
      setError("Impossible d'accéder à la caméra. Vérifiez les permissions.");
    }
  };

  // 2. Arrêter la caméra (important pour libérer le matériel)
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  // 3. Capturer l'image depuis le flux vidéo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Ajuster la taille du canvas à la vidéo réelle
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Dessiner l'image actuelle de la vidéo sur le canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convertir le canvas en Base64 pour la preview
      const previewUrl = canvas.toDataURL('image/jpeg');

      // Convertir le canvas en Blob/File pour ton backend
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
          onPhotoCaptured(file, previewUrl);
          stopCamera();
          onClose();
        }
      }, 'image/jpeg', 0.85); // 0.85 = qualité de compression
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-100 flex flex-col items-center gap-4 p-4 bg-gray-900 rounded-xl text-white">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="relative w-full max-w-md h-[300px] bg-black rounded-lg overflow-hidden">
        {/* Balise vidéo qui affiche le flux en direct */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        {/* Canvas caché qui sert uniquement à fabriquer le fichier JPG */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex gap-4">
        {!stream ? (
          <CTA type="button" color="primary" text="Activer la caméra" onClick={startCamera} />
        ) : (
          <CTA type="button" color="primary" text="Prendre la photo" onClick={capturePhoto} />
        )}
        <CTA type="button" color="gray" text="Annuler" onClick={() => { stopCamera(); onClose(); }} />
      </div>
    </div>
  );
}