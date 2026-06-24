'use client'
import React, { useEffect } from 'react'
import dynamic from 'next/dynamic'
import PicModal from './PicModal'
import AddPlanModal, { UploadPlanCredentials } from './AddPlanModal'
import VisualizerMenu, { SelectOption } from '../../molecules/VisualizerMenu/VisualizerMenu'
import ProjectFolders from '../ProjectFolders/ProjectFolders'

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { usePlanStore } from '@/stores/AllPlansStore'
import { fetchPlan, getLastOpenedPlan, getPlanById } from '@/proxy/plan/plan-functions'
import { FolderType, MarkerPhotoType, MarkerType, PlanType } from '@/types/project'
import { useCurrentProjectStore } from '@/stores/CurrentProjectStore'
import { getFolder, getProjectRootFolder } from '@/proxy/folders/folder-functions'
import { useSearchParams } from 'next/navigation'
import { addMarker, deleteMarker, editMarker, getMarkers } from '@/proxy/markers/marker-functions'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { updateProjectThumbnail } from '@/proxy/projects/project-functions'
import Image from 'next/image'
import CTA from '../../atoms/CTA'

const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });

interface PlanLoaderProps {
  projectId: string;
  onPlanChange?: (plan: PlanType) => void; // Callback pour notifier le changement de plan
  
}

function PlanLoader({ projectId, onPlanChange }: PlanLoaderProps) {
  const [markers, setMarkers] = React.useState<MarkerType[]>([]);
  const currentClickCoords = React.useRef({x: 0, y: 0})
  const [isModalActive, setIsModalActive] = React.useState<boolean>(false)
  const [temporaryModalMarker, setTemporaryModalMarker] = React.useState<MarkerType | undefined>(undefined)
  const [isAddPlanModalActive, setIsAddPlanModalActive] = React.useState<boolean>(false);

  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');

  // console.log("render")

  const [currentPageNumber, setCurrentPageNumber] = React.useState(1);
  const [numPages, setNumPages] = React.useState<number | null>(0);

  // État pour gérer le fichier (PDF ou Image)
  const [currentFileUrl, setCurrentFileUrl] = React.useState<string | null>(null);
  const [isPdf, setIsPdf] = React.useState<boolean>(false);

  const setCurrentPlan = usePlanStore((state) => state.setCurrentPlan);
  const currentPlan = usePlanStore((state) => state.currentPlan);

  const setCurrentProjectTitle = useCurrentProjectStore((state) => state.setCurrentProjectTitle);


  const planUploadContainerRef = React.useRef<HTMLDivElement | null>(null);
  const planContainerRef = React.useRef<HTMLDivElement | null>(null)
  const photoInputRef = React.useRef<HTMLInputElement | null>(null);

  const [option, setOption] = React.useState<SelectOption>('hand');

  //État pour gérer le dossier actif
  const [activeFolder, setActiveFolder] = React.useState<FolderType | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function setupPdfWorker() {
      const { pdfjs } = await import('react-pdf');
      if (!isMounted) return;
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }
    setupPdfWorker();
    return () => {
      isMounted = false;
    };
  }, []);

  

  function selectOption(option: SelectOption) {
    setOption(option);
  }

  const displayPlan = React.useCallback(({
    planId,
    planName,
    storageKey,
    temporaryAccessUrl,
    isPdfDocument
  }: UploadPlanCredentials) => {
    setIsPdf(isPdfDocument);
    setCurrentFileUrl(temporaryAccessUrl);
    setCurrentPlan({ id: planId, name: planName, storageKey: storageKey, temporaryAccessUrl, isPdfDocument: isPdfDocument });
    setMarkers([]);
  }, [setCurrentPlan]);

  function handlePlanClick(event: React.MouseEvent) {
    if(option !== 'pin') return;
    // Empêcher le clic de se déclencher si on est en train de "glisser/panner" le plan
    // ou si on clique sur un marqueur
    if (event.currentTarget.classList.contains('marker')) return;
    if (!planContainerRef.current || !photoInputRef.current) return;

    const rect = planContainerRef.current.getBoundingClientRect();
    
    // Le calcul en pourcentage reste parfait même avec le zoom !
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    currentClickCoords.current = {x, y};
    photoInputRef.current.click();
  }

  function chooseMarkerPic(event: React.ChangeEvent<HTMLInputElement>){

    const files = event.target.files
    if(!files) return

    const file = files[0]

    if (file) {
        const previewUrl = URL.createObjectURL(file);

        const newMarker: MarkerType = {
            coordX: currentClickCoords.current.x,
            coordY: currentClickCoords.current.y,
            title: '',
            photos: [
              {
                label: '',
                comment: '',
                previewUrl,
                physicalFile: file
              }
            ]
        };

        //permettre d'ajouter un titre et des commentaires dès l'ajout du marqueur
        setIsModalActive(true);
        setTemporaryModalMarker(newMarker);

        // Réinitialiser l'input pour permettre de charger la même photo plusieurs fois
        if(!photoInputRef.current) return
        photoInputRef.current.value = '';
    }
  }

  async function handleAddMarker(marker: MarkerType){
    // Call API pour sauvegarder le marqueur dans la BDD et récupérer son ID généré

    const markerFormData = new FormData();

    const markertoRegister = {
      title: marker.title,
      coordX: marker.coordX,
      coordY: marker.coordY,
      photosMetaData: marker.photos.map(photo => ({
        label: photo.label,
        comment: photo.comment,
      })),
    }

    markerFormData.append('markerData', JSON.stringify(markertoRegister));

    marker.photos.forEach((photo) => {
      markerFormData.append('photos', photo.physicalFile);
    });

    try{
      const response = await addMarker(markerFormData, projectId, currentPlan?.id as string, currentPageNumber);
      if(!response.ok){
        console.error("Erreur lors de l'ajout du marqueur :", response.statusText);
        return;
      } else {
        const result = await response.json();
        
        setMarkers(prevMarkers => [...prevMarkers, result]);
        setTemporaryModalMarker(undefined);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du marqueur :", error);
    }
  }

  async function updateMarkerPhoto(marker: MarkerType){
    const updateMarkerFormData = new FormData();

    const existingPhotos = marker.photos.filter(photo => photo.id);
    const newPhotos = marker.photos.filter(photo => !photo.id);

    const matchingMarker = markers.find(m => m.id === marker.id)
    const keptPhotoIdentifiersSet = new Set(existingPhotos.map(photoItem => photoItem.id));

    // 3. On extrait les identifiants supprimés de manière sécurisée
    const deletedPhotoIdentifiers = matchingMarker?.photos
      .map(photoItem => photoItem.id)
      .filter(photoIdentifier => !keptPhotoIdentifiersSet.has(photoIdentifier) && photoIdentifier !== undefined) || [];

    const markerToUpdatePayload = {
      title: marker.title,
      coordX: marker.coordX,
      coordY: marker.coordY,

      // On envoie les métadonnées des photos existantes pour les mettre à jour
      existingPhotosToUpdate: existingPhotos.map(photoItem => ({
        identifier: photoItem.id,
        label: photoItem.label,
        comment: photoItem.comment,
      })),

      // On envoie les métadonnées des nouvelles photos
      newPhotosMetadata: newPhotos.map(photoItem => ({
        label: photoItem.label,
        comment: photoItem.comment,
      })),

      deletedPhotoIdentifiers: deletedPhotoIdentifiers
    }

    updateMarkerFormData.append('markerData', JSON.stringify(markerToUpdatePayload));

    newPhotos.forEach((photo) => {
      updateMarkerFormData.append('newPhotos', photo.physicalFile);
    });

    try{
      const response = await editMarker(projectId, currentPlan?.id as string, marker.id as string, updateMarkerFormData);
      if(!response.ok){
        console.error("Erreur lors de la mise à jour du marqueur :", response.statusText);
        return;
      } else {
        const result = await response.json();
        const updatedMarker = result.updatedMarker;
        
        setMarkers(prevMarkers => prevMarkers.map(m => m.id === marker.id ? updatedMarker : m));
        setTemporaryModalMarker(undefined);
        handleCloseModal();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du marqueur :", error);
    }
    
  }

  function handleMarkerClick(event: React.MouseEvent, marker: MarkerType) {
    event.stopPropagation();
    setIsModalActive(true);
    setTemporaryModalMarker(marker);
  }

  function handleCloseModal(){
    setIsModalActive(false)
    setTemporaryModalMarker(undefined);
  }

  function handleSetTitle(e: React.ChangeEvent<HTMLInputElement>, marker: MarkerType){
    const { value } = e.target as HTMLInputElement;

    const updatedMarker  = { ...marker, title: value };
    setTemporaryModalMarker(updatedMarker);
  }

  function handleSetPhotoText(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, markerPhoto: MarkerPhotoType, markerPhotoIndex: number){
    if(!temporaryModalMarker) return;

    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;

    const updatedPhoto: MarkerPhotoType = { ...markerPhoto, [name === 'pic-label' ? 'label' : 'comment']: value };

    setTemporaryModalMarker(prev => {
      if(!prev) return prev;

      const updatedPhotos = [...prev.photos];
      updatedPhotos[markerPhotoIndex] = updatedPhoto;

      return { ...prev, photos: updatedPhotos };
    });
    
  }

  async function handleDeleteMarker(marker: MarkerType){
    // Appel API pour supprimer le marqueur de la BDD
    if(!marker.id) return;
    
    const response = await deleteMarker(marker.id);
    if(!response.ok){
      console.error("Erreur lors de la suppression du marqueur :", response.statusText);
      return;
    } else {
      setMarkers(prevMarkers => prevMarkers.filter(m => m.id !== marker.id));
      setIsModalActive(false);
    }
  }

  useEffect(() => {
    async function fetchPlan() {
      if(!currentFileUrl){
        let response;

        if(planId) {
          response = await getPlanById(projectId, planId);
        } else {
          response = await getLastOpenedPlan(projectId);
        }
        
        if(response.ok){
          const result = await response.json();
          
          if(result) {
            
            if(onPlanChange) onPlanChange(result);
            const isActuallyPdf = result.documentStorageKey.toLowerCase().endsWith('.pdf');
            displayPlan({
              planId: result.id,
              planName: result.name,
              storageKey: result.documentStorageKey,
              temporaryAccessUrl: result.temporaryAccessUrl,
              isPdfDocument: isActuallyPdf
            });
            setCurrentProjectTitle(result.project.title);
          }
        } else {
          console.error("Erreur lors de la récupération du dernier plan ouvert :", response.statusText);
        }
      }
    }

    fetchPlan();
    
  }, [
    currentFileUrl,
    displayPlan,
    onPlanChange,
    planId,
    projectId,
    setCurrentProjectTitle
  ])

  
  useEffect(() => {
    async function fetchMarkersForCurrentPlan() {
      if(!currentPlan?.id) return;
      const response = await getMarkers(currentPlan?.id as string, currentPageNumber);
      if(response.ok){
        const result = await response.json();
        const fetchedMarkers = result.markers;
        setMarkers(fetchedMarkers);
      } else {
        console.error("Erreur lors de la récupération des marqueurs :", response.statusText);
      }
    }

    fetchMarkersForCurrentPlan()
  }, [currentPlan?.id, currentPageNumber])

  useEffect(() => {
    if(!activeFolder?.id) {
      async function fetchProjectRootFolder(){
        const response = await getProjectRootFolder(projectId);
        if(response.ok){
          const result = await response.json();
          setActiveFolder(result);
        } else {
          console.error("Erreur lors de la récupération du dossier racine du projet :", response.statusText);
        }
      }
  
      fetchProjectRootFolder();
    }
  }, [activeFolder?.id, projectId])

  function updateUIOnCreateFolder(newFolder: FolderType){
    if(activeFolder && activeFolder.id === newFolder.parentId){
      setActiveFolder(prev => {
        if(!prev) return prev;
        return { ...prev, subfolders: [...prev.subfolders, newFolder] }
      });
    }
  }

  function updateUIOnAddPlan(newPlan: PlanType){
    if(activeFolder){
      setActiveFolder(prev => {
        if(!prev) return prev;
        return { ...prev, plans: [...prev.plans, newPlan] }
      });
    }
  }

  function updateUIOnDeleteNode(nodeId: string, type: 'folder' | 'plan'){
    setActiveFolder(prev => {
      if(!prev) return prev;
      if(type === 'folder'){
        return { ...prev, subfolders: prev.subfolders.filter(folder => folder.id !== nodeId) }
      } else {
        return { ...prev, plans: prev.plans.filter(plan => plan.id !== nodeId) }
      }
    })
  }

  function updateUIOnRenameNode(nodeId: string, newName: string, type: 'folder' | 'plan'){
    setActiveFolder(prev => {
      if(!prev) return prev;
      if(type === 'folder'){
        return { ...prev, subfolders: prev.subfolders.map(folder => folder.id === nodeId ? { ...folder, name: newName } : folder) }
      } else {
        return { ...prev, plans: prev.plans.map(plan => plan.id === nodeId ? { ...plan, name: newName } : plan) }
      }
    })
  }

  async function onNavigateToFolder(folderId: string){
    const response = await getFolder(folderId, projectId);
    if(response.ok){
      const result = await response.json();
      setActiveFolder(result);
    } else {
      console.error("Erreur lors de la récupération du dossier :", response.statusText);
    }
  }

  async function onLoadPlan(planId: string){
    const response = await fetchPlan(planId);
    if(response.ok){
      const result = await response.json();
      const plan = result;
      const isActuallyPdf = plan.documentStorageKey.toLowerCase().endsWith('.pdf');
      displayPlan({
        planId: plan.id,
        planName: plan.name,
        storageKey: plan.documentStorageKey,
        temporaryAccessUrl: plan.temporaryAccessUrl,
        isPdfDocument: isActuallyPdf
      });
      if(onPlanChange) onPlanChange(plan);
    } else {
      console.error("Erreur lors du chargement du plan :", response.statusText);
    }
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setCurrentPageNumber(1);
    setNumPages(numPages);
  }

  function navigatePreviousPage() {
    setCurrentPageNumber(prev => Math.max(prev - 1, 1));
  }

  function navigateNextPage() {
    setCurrentPageNumber(prev => numPages ? Math.min(prev + 1, numPages) : prev + 1);
  }

  
  const lastThumbnailPlanIdRef = React.useRef<string | null>(null);
  const thumbnailJobRef = React.useRef<number | null>(null);

  function scheduleThumbnail() {
    if (thumbnailJobRef.current !== null) return;

    const run = () => {
      thumbnailJobRef.current = null;
      void createThumbnail();
    };

    const requestIdle = (window as typeof window & {
      requestIdleCallback?: (cb: IdleRequestCallback, opts?: IdleRequestOptions) => number;
    }).requestIdleCallback;

    if (requestIdle) {
      thumbnailJobRef.current = requestIdle(run, { timeout: 1000 });
    } else {
      thumbnailJobRef.current = window.setTimeout(run, 200);
    }
  }

  async function createThumbnail(){
    if(!currentPlan?.id) return;
    if(lastThumbnailPlanIdRef.current === currentPlan.id) return;
    if(!planContainerRef.current) return;

    let sourceCanvas: HTMLCanvasElement | null = null;

    if(isPdf) {
      sourceCanvas = planContainerRef.current.querySelector('canvas.react-pdf__Page__canvas');
      if(!sourceCanvas) return;
    } else {
      const img = planContainerRef.current.querySelector('img');
      if(!img || !img.complete) return;

      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;

      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      sourceCanvas = canvas;
    }

    const thumbnailBlob = await new Promise<Blob | null>(resolve => sourceCanvas?.toBlob(resolve, 'image/jpeg', 0.8));
    if(!thumbnailBlob) return;

    const formData = new FormData();
    formData.append('file', thumbnailBlob, `${currentPlan?.name}-thumbnail.jpg`);

    try{
      const response = await updateProjectThumbnail(projectId, formData);
      if(!response.ok){
        console.error("Erreur lors de la mise à jour de la miniature du projet :", response.statusText);
        return;
      } else {
        lastThumbnailPlanIdRef.current = currentPlan.id;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la miniature du projet :", error);
    }
  }
  
  return (
    <div className="relative w-full h-full bg-gray-100  flex flex-col">
      
      {!currentFileUrl ? (
        <div id="plan-upload-container" className="w-full max-w-sm relative top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 p-6 rounded-lg border border-gray-200" ref={planUploadContainerRef}>
          <div className="text-center mb-4">
            <h2 className="block text-lg font-medium mb-2">Vous n&apos;avez aucun plan pour le moment</h2>
            <p>Chargez-en un ici</p>
          </div>

          <div className="flex justify-center">
            <CTA 
              color="primary"
              type='button'
              text='Charger un plan'
              onClick={() => setIsAddPlanModalActive(true)}
            />
          </div>
        </div>
      ) : (
        // Conteneur qui contient le plan

        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8} // Zoom max
          wheel={{ step: 0.15 }} // Sensibilité de la molette
          panning={{ velocityDisabled: true }} // Rend le glissement plus précis sur mobile
          limitToBounds={false} // 💡 Crucial sur mobile : permet de scroller librement sans blocage aux bords
        >
          {() => (
            <>
              {isPdf && (
                <div className="min-w-30 max-w-60 w-full absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center justify-between gap-4 bg-white p-2 rounded-lg shadow-md">
                  <ChevronLeft className="cursor-pointer rounded-full w-8 h-8 hover:bg-gray-200" onClick={navigatePreviousPage}/>
                  <p className="select-none">
                    Page {currentPageNumber} sur {numPages || '...'}
                  </p>
                  <ChevronRight className="cursor-pointer rounded-full w-8 h-8 hover:bg-gray-200" onClick={navigateNextPage}/>
                </div>
              )}

              {/* 💡 CORRECTION : On retire 'flex items-center justify-center' qui force le recentrage */}
              <TransformComponent 
                wrapperClass="!w-full !h-full" 
                contentClass="!w-auto !h-auto block"
              >
                {/* 💡 CORRECTION : 'inline-block' ou 'block' pour que le wrapper épouse la taille exacte du plan */}
                <div 
                  ref={planContainerRef} 
                  className="relative bg-white block select-none touch-none" 
                  onClick={handlePlanClick}
                >
                  {isPdf ? (
                    <Document file={currentFileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                      <Page
                        pageNumber={currentPageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        onRenderSuccess={scheduleThumbnail}
                      />
                    </Document>
                  ) : (
                    <Image
                      src={currentFileUrl}
                      alt="Plan"
                      width={1}
                      height={1}
                      sizes="100vw"
                      className="max-w-none"
                      style={{ width: '100%', height: '100%' }}
                      onLoad={scheduleThumbnail}
                      unoptimized // Pour éviter le bug d'URL présignée vu ensemble !
                    />
                  )}

                  {/* Affichage des marqueurs */}
                  {markers.map((marker, index) => (
                    <div
                      key={marker.id ?? index}
                      className="marker absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm cursor-pointer border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform z-10"
                      style={{ left: `${marker.coordX}%`, top: `${marker.coordY}%` }}
                      onClick={(e) => handleMarkerClick(e, marker)}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}



      {/* Input caché pour le chargement des photos */}
      <input
        type="file"
        id="photo-input"
        accept="image/*"
        className='hidden'
        ref={photoInputRef}
        onChange={chooseMarkerPic}
      />

      {currentPlan && <VisualizerMenu option={option} selectOption={selectOption}/>}
      

      <PicModal
        isActive={isModalActive}
        marker={temporaryModalMarker}
        handleSetTitle={handleSetTitle}
        handleSetPhotoText={handleSetPhotoText}
        handleAddMarker={handleAddMarker}
        handleUpdateMarkerPhoto={updateMarkerPhoto}
        handleDeleteMarker={handleDeleteMarker}
        handleClose={handleCloseModal}
      />

      <AddPlanModal
        projectId={projectId}
        isActive={isAddPlanModalActive}
        activeFolderId={activeFolder?.id}
        onClose={() => setIsAddPlanModalActive(false)}
        handleUploadPlan={displayPlan}
        createAndUploadPlan={true}
      />

      <ProjectFolders
        activeFolder={activeFolder}
        projectId={projectId}
        updateUIOnCreateFolder={updateUIOnCreateFolder}
        updateUIOnAddPlan={updateUIOnAddPlan}
        updateUIOnDeleteNode={updateUIOnDeleteNode}
        updateUIOnRenameNode={updateUIOnRenameNode}
        triggerNavigateToFolder={onNavigateToFolder}
        triggerLoadPlan={onLoadPlan}
      />
    </div>
  )
}

export default PlanLoader