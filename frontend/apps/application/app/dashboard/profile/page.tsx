'use client'
import Input from '@/app/components/atoms/Input';
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import { CTA } from '@repo/ui';
import React, { use, useEffect } from 'react'

function ProfilePage() {
  const {user, setUser} = useUser();

  const [personalInfo, setPersonalInfo] = React.useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || ''
  });

  const [passwordInfo, setPasswordInfo] = React.useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if(user){
      setPersonalInfo({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      });
    }
  }, [user])


  async function handleModifyPersonalInfo(e?: React.MouseEvent){
    e?.preventDefault();

  }

  async function handleModifyProfilePicture(e?: React.MouseEvent){
    e?.preventDefault();
  }

  async function handleModifyPassword(e?: React.MouseEvent){
    e?.preventDefault();
  }
  
  return (
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
                onClick={handleModifyPersonalInfo}
              />
            </div>
          </form>
        </div>
      </section>

      
      <section className="mt-12 max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto">
        <div>
          <h2 className="font-medium">Photo de profil</h2>
          <p className='text-sm text-gray-600 mt-1'>Mettez à jour votre photo de profil.</p>
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
                onClick={() => {}}
              />
              
              <CTA
                color='primary'
                text='Enregistrer'
                type='button'
                onClick={handleModifyProfilePicture}
              />
            </div>
          </form>
        </div>
      </section>


      <section className="max-w-7xl flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:mx-auto  mt-12">
        <div>
          <h2 className="font-medium">Sécurité</h2>
          <p className='text-sm text-gray-600 mt-1'>Changez votre mot de passe en toute sécurité.</p>
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

            <div className="flex justify-end">
              <CTA
                color='primary'
                text='Enregistrer'
                type='button'
                onClick={handleModifyPassword}
              />
            </div>
          </form>
        </div>
      </section>


      
    </div>
  )
}

export default ProfilePage