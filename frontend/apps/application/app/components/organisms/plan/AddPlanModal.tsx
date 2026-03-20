'use client'
import React from 'react'
import Input from '../../atoms/Input'
import { CTA } from '@repo/ui'
import { Cross, Plus, X } from 'lucide-react'
import { convertFileSizeInMo } from '@/utils/files'
import { PlanType } from '@/types/project'
import { uploadPlan } from '@/proxy/plan/plan-functions'

interface AddPlanModalProps {
  isActive: boolean
  projectId: string;
  onClose: () => void;
  handlePickFile: (plan: PlanType) => void;
}

function AddPlanModal({ isActive, projectId, onClose, handlePickFile }: AddPlanModalProps) {
  const [plan, setPlan] = React.useState<PlanType | null>(null);
  
  const photoinputRef = React.useRef<HTMLInputElement | null>(null);

  const isDisabled = plan == null || plan?.name.trim() === '' || plan?.file === null;

  function handleChangePlanTitle(event: React.ChangeEvent<HTMLInputElement>){
    setPlan(prevPlan => prevPlan ? { ...prevPlan, name: event.target.value } : { name: event.target.value, file: null as unknown as File });
  }

  function handleChangePlanPDF(event: React.ChangeEvent<HTMLInputElement>){
    const files = event.target.files

    if(!files) return

    const file = files[0]
    setPlan(prevPlan => prevPlan ? { ...prevPlan, file } : { name: '', file });
  }

  async function onConfirm(){
    if(!plan) return;
    if(!plan.file) return;

    const formData = new FormData();
    formData.append('file', plan.file);
    formData.append('name', plan.name);

    const response = await uploadPlan(formData, projectId);
    if(!response.ok){
      console.error(response.json());
      return;
    } else {
      const responseData = await response.json();
      console.log(responseData);
    }

    handlePickFile(plan);
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
          {plan && plan.file && (
            <div className="flex items-center gap-2 py-1 px-2 border border-primary rounded-full w-fit mt-3">
              <p className="text-sm text-gray-600">{plan.file.name} {convertFileSizeInMo(plan.file.size)} Mo</p>
              <X 
                className="w-5 h-5 cursor-pointer"
                onClick={() => {setPlan(prevPlan => prevPlan ? { ...prevPlan, file: null as unknown as File } : null); if(photoinputRef.current) photoinputRef.current.value = ''}}
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
          accept='application/pdf, image/*'
          ref={photoinputRef}
          onChange={handleChangePlanPDF}
        />

      </div>
    </div>
  )
}

export default AddPlanModal