'use client'
import Input from '@/app/components/atoms/Input';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import { editPasswordInfo, editPersonalInfo, editUserPicture } from '@/proxy/profile/profile-functions';
import { CTA } from '@repo/ui';
import React, { useEffect } from 'react'
import Toast from '@/app/components/molecules/Toast/Toast'
import ProfilePicturePreview from '@/app/components/molecules/ProfilePicturePreview/ProfilePicturePreview';

function ProfilePage() {
  const {user, setUser} = useUser();

  const [personalInfo, setPersonalInfo] = React.useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || ''
  });

  const [passwordInfo, setPasswordInfo] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  });

  const [isProfilePicturePreviewOpen, setIsProfilePicturePreviewOpen] = React.useState(false);

  const [newProfilePictureFile, setNewProfilePictureFile] = React.useState<File | null>(null);
  const [newBannerPictureFile, setNewBannerPictureFile] = React.useState<File | null>(null);


  const profilePictureInputRef = React.useRef<HTMLInputElement>(null);
  const bannerPictureInputRef = React.useRef<HTMLInputElement>(null);

  const [personalInfoToast, setPersonalInfoToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [profilePictureToast, setProfilePictureToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const [passwordInfoToast, setPasswordInfoToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    if(user){
      setPersonalInfo({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      });
    }
  }, [user])


  async function handleEditPersonalInfo(e?: React.MouseEvent){
    e?.preventDefault();
    const response = await editPersonalInfo(personalInfo);
    if(response.ok){
      const data = await response.json();
      const updatedUser = data.updatedUser;
      setUser(updatedUser);
      console.log(data.message);
      setPersonalInfoToast({
        message: data.message,
        type: 'success'
      });
    } else {
      setPersonalInfoToast({
        message: "Erreur lors de la mise à jour des informations personnelles",
        type: 'error'
      });
    }
  }

  async function handleChangeProfilePictureInput(e: React.ChangeEvent<HTMLInputElement>){
    e.preventDefault();
    const file = e.target.files?.[0];
    if(file){
      console.log("Fichier sélectionné pour la photo de profil :", file);
      setNewProfilePictureFile(file);
      setIsProfilePicturePreviewOpen(true);
    }
  }

  async function handleEditProfilePicture(e?: React.MouseEvent){
    e?.preventDefault();
    const formData = new FormData();
    if(newProfilePictureFile){
      formData.append('file', newProfilePictureFile);
      formData.append('type', 'PROFILE');
    } else {
      console.error("Aucun nouveau fichier de photo de profil à télécharger.");
      return;
    }

    const response = await editUserPicture(formData);
    const data = await response.json();

    if(response.ok){
      setProfilePictureToast({
        message: data.message,
        type: 'success'
      });
      // Optionnel : mettre à jour l'URL de la photo de profil dans le contexte utilisateur si nécessaire
    } else {
      setProfilePictureToast({
        message: data.message || "Erreur lors de la mise à jour de la photo de profil",
        type: 'error'
      });
    }
    
  }

  async function handleChangeBannerPictureInput(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];
    if(file){
      setNewBannerPictureFile(file);
    }
  }

  async function handleEditBannerPicture(e?: React.MouseEvent){
    e?.preventDefault();
    const formData = new FormData();
    if(newBannerPictureFile){
      formData.append('file', newBannerPictureFile);
      formData.append('type', 'BANNER');
    } else {
      console.error("Aucun nouveau fichier de photo de bannière à télécharger.");
      return;
    }

    const response = await editUserPicture(formData);
    const data = await response.json();

    if(response.ok){
      setProfilePictureToast({
        message: data.message,
        type: 'success'
      });
      // Optionnel : mettre à jour l'URL de la photo de bannière dans le contexte utilisateur si nécessaire
    } else {
      setProfilePictureToast({
        message: data.message || "Erreur lors de la mise à jour de la photo de bannière",
        type: 'error'
      });
    }
  }

  async function handleEditPassword(e?: React.MouseEvent){
    e?.preventDefault();
    const response = await editPasswordInfo(passwordInfo);

    const data = await response.json();
    if(data.success) {
      setPasswordInfoToast({
        message: data.message,
        type: 'success'
      });

      setPasswordInfo({
        currentPassword: '',
        newPassword: '',
        confirmationPassword: ''
      });
    } else {
      setPasswordInfoToast({
        message: data.message,
        type: 'error'
      });
    }  
    
  }
  
  return (
    <>
      <ProfilePicturePreview
        isVisible={isProfilePicturePreviewOpen}
        file={newProfilePictureFile}
        onClose={() => setIsProfilePicturePreviewOpen(false)}
      />
      <div className="p-4">
        {/* profile header */}
        <section className="relative w-full h-52 bg-gray-200 rounded-md mb-24">

          <div className="absolute -bottom-18 left-2 flex items-center gap-2">
            {/* Profile picture */}
            <div className="w-24 h-24 rounded-full bg-gray-400 border-4 border-white">

            </div>

            <div className='mt-8'>
              <h1 className="text-xl font-semibold">{user?.firstname} {user?.lastname}</h1>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>

          </div>
        </section>

        <section className="max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto">
          <div>
            <h2 className="font-medium">Informations personnelles</h2>
            <p className='text-sm text-gray-600 mt-1'>Mettez à jour vos informations personnelles à tout moment.</p>

            {personalInfoToast && (
              <div className="mt-4">
                <Toast
                  message={personalInfoToast.message}
                  type={personalInfoToast.type}
                  durationMs={3000}
                  onClose={() => setPersonalInfoToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form
              className='space-y-6'
            >
              <div className='space-y-6 md:flex md:items-center md:gap-4 md:space-y-0'>
                <Input
                  label='Prénom'
                  type='text'
                  name='firstname'
                  placeholder='Entrez votre prénom'
                  value={personalInfo.firstname}
                  onChange={(e) => setPersonalInfo({...personalInfo, firstname: e.target.value})}
                  className='md:flex-1'
                />

                <Input
                  label='Nom'
                  type='text'
                  name='lastname'
                  placeholder='Entrez votre nom'
                  value={personalInfo.lastname}
                  onChange={(e) => setPersonalInfo({...personalInfo, lastname: e.target.value})}
                  className='md:flex-1'
                />
              </div>
              
              <Input
                label='Email'
                type='email'
                name='email'
                placeholder='Entrez votre email'
                value={personalInfo.email}
                onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
              />

              <div className="flex justify-end">
                <CTA
                  color='primary'
                  text='Enregistrer'
                  type='button'
                  onClick={handleEditPersonalInfo}
                />
              </div>
            </form>
          </div>
        </section>

        
        <section className="mt-12 max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto">
          <div>
            <h2 className="font-medium">Photo de profil</h2>
            <p className='text-sm text-gray-600 mt-1'>Mettez à jour votre photo de profil.</p>

            {profilePictureToast && (
              <div className="mt-4">
                <Toast
                  message={profilePictureToast.message}
                  type={profilePictureToast.type}
                  durationMs={3000}
                  onClose={() => setProfilePictureToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form
              className='space-y-6'
            >
              
              <div className="w-32 h-32 rounded-full bg-gray-400 border-4 border-gray-200 mx-auto">

              </div>

              <div className="flex justify-end gap-6">
                <CTA
                  color='secondary'
                  text='Choisir une photo'
                  type='button'
                  onClick={(e) => {
                    e?.preventDefault();
                    profilePictureInputRef.current?.click()
                  }}
                />
                
                <CTA
                  color='primary'
                  text='Enregistrer'
                  type='button'
                  onClick={handleEditProfilePicture}
                />
              </div>
            </form>
          </div>

          <input
            type="file"
            name="profile-picture"
            id="profile-picture"
            className='hidden'
            onChange={handleChangeProfilePictureInput}
            ref={profilePictureInputRef}
          />

          <input
            type="file"
            name="banner-picture"
            id="banner-picture"
            className='hidden'
            onChange={handleChangeBannerPictureInput}
            ref={bannerPictureInputRef}
          />
        </section>


        <section className="max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto  mt-12">
          <div>
            <h2 className="font-medium">Sécurité</h2>
            <p className='text-sm text-gray-600 mt-1'>Changez votre mot de passe en toute sécurité.</p>

            {passwordInfoToast && (
              <div className="mt-4">
                <Toast
                  message={passwordInfoToast.message}
                  type={passwordInfoToast.type}
                  durationMs={3000}
                  onClose={() => setPasswordInfoToast(null)}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-md p-4 w-full md:max-w-2xl border border-gray-200">
            <form
              className='space-y-6'
            >
                <Input
                  label='Mot de passe actuel'
                  type='password'
                  name='currentPassword'
                  placeholder='Entrez votre mot de passe actuel'
                  value={passwordInfo.currentPassword}
                  onChange={(e) => setPasswordInfo({...passwordInfo, currentPassword: e.target.value})}
                />
              
              <Input
                label='Nouveau mot de passe'
                type='password'
                name='new-password'
                placeholder='Entrez votre nouveau mot de passe'
                value={passwordInfo.newPassword}
                onChange={(e) => setPasswordInfo({...passwordInfo, newPassword: e.target.value})}
              />

              <Input
                label='Confirmation du mot de passe'
                type='password'
                name='confirmation-password'
                placeholder='Confirmez votre nouveau mot de passe'
                value={passwordInfo.confirmationPassword}
                onChange={(e) => setPasswordInfo({...passwordInfo, confirmationPassword: e.target.value})}
              />

              <div className="flex justify-end">
                <CTA
                  color='primary'
                  text='Enregistrer'
                  type='button'
                  onClick={handleEditPassword}
                />
              </div>
            </form>
          </div>
        </section>


        
      </div>
    
    </>
  )
}

export default ProfilePage