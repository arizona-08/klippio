'use client'
import React from 'react'
import Input from '../../atoms/Input'
import { CTA } from '@repo/ui'
import { Cross, Plus, X } from 'lucide-react'
import { convertFileSizeInMo } from '@/utils/files'

interface AddPlanModalProps {
  isActive: boolean
  onClose: () => void;
  handlePickFile: (file: File) => void;
}

function AddPlanModal({ isActive, onClose, handlePickFile }: AddPlanModalProps) {
  const [planTitle, setPlanTitle] = React.useState<string>('');
  const isDisabled = planTitle.trim() === ''

  const photoinputRef = React.useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  function handleChangePlanTitle(event: React.ChangeEvent<HTMLInputElement>){
    setPlanTitle(event.target.value)
  }

  function handleChangePlanPDF(event: React.ChangeEvent<HTMLInputElement>){
    const files = event.target.files

    if(!files) return

    const file = files[0]
    setSelectedFile(file)
  }

  function onConfirm(){
    if(!selectedFile) return;

    handlePickFile(selectedFile);
    onClose();
  }

  return (
    <div className={`bg-black/25 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center p-4 ${isActive ? 'block' : 'hidden'}`}>
      <div className="w-full max-w-md bg-white p-4 rounded-md text-center">
        <h3 className="text-xl font-semibold mb-4">Ajouter un plan</h3>
        <Input
          type='text'
          name='plan-title'
          label='Titre du plan'
          placeholder='Entrez le titre du plan'
          onChange={handleChangePlanTitle}
        />

        <div className="mt-3">
          <CTA
            type='button'
            text='Ajouter une image'
            color='secondary'
            icon={<Plus/>}
            iconReverse={true}
            onClick={() => photoinputRef.current?.click()}
          />
        </div>

        <div>
          {selectedFile && (
            <div className="flex items-center gap-2 py-1 px-2 border border-primary rounded-full w-fit mt-3">
              <p className="text-sm text-gray-600">{selectedFile.name} {convertFileSizeInMo(selectedFile.size)} Mo</p>
              <X 
                className="w-5 h-5 cursor-pointer"
                onClick={() => {setSelectedFile(null)}}
              />
            </div>
          )}
        </div>
        <div className="actions flex gap-4 mt-4">
          <div className="w-full flex-1">
            <CTA
              type='button'
              text='Annuler'
              color='gray'
              onClick={onClose}
            />
          </div>

          <div className="w-full flex-1">
          <CTA
            type='button'
            text='Confirmer'
            color='primary'
            disabled={isDisabled}
            onClick={onConfirm}
          />
          </div>
        </div>

        <input
          type="file"
          name=""
          id="file-input"
          className="hidden"
          ref={photoinputRef}
          onChange={handleChangePlanPDF}
        />

      </div>
    </div>
  )
}

export default AddPlanModal