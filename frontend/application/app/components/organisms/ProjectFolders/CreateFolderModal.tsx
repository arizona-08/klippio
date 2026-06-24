import React from 'react'
import Input from '../../atoms/Input';
import CTA from '../../atoms/CTA';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (folderName: string) => void;
}

function CreateFolderModal({ isOpen, onClose, onCreate }: CreateFolderModalProps) {
  const [folderName, setFolderName] = React.useState('');

  function handleChangeFolderName(event: React.ChangeEvent<HTMLInputElement>) {
    setFolderName(event.target.value);
  }

  function handleSubmit(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    if (folderName.trim() === '') return;
    onCreate(folderName.trim());
    setFolderName('');
    onClose();
  }

  function handleOnClose(e?: React.MouseEvent<HTMLButtonElement>) {
    e?.preventDefault();
    setFolderName('');
    onClose();
  }
  return (
    <>
      <div className={`fixed inset-0 bg-black/35 backdrop-blur-sm z-60 ${isOpen ? 'block' : 'hidden'}`}></div>
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 z-70 w-full max-w-md ${isOpen ? 'block' : 'hidden'}`}>
        <h2 className="text-xl font-semibold mb-4">Créer un nouveau dossier</h2>

        <form>
          <Input
            name='folder_name'
            placeholder='Nom du dossier'
            label='Nom du dossier'
            type='text'
            onChange={handleChangeFolderName}
          />

          <div className="form-actions mt-6 flex justify-between">
            <CTA 
              type='button'
              color='secondary'
              text='Annuler'
              onClick={handleOnClose}
            />

            <CTA 
              type='button'
              color='primary'
              text='Créer'
              onClick={handleSubmit}
            />
          </div>
        </form>

      </div>
    </>
  )
}

export default CreateFolderModal