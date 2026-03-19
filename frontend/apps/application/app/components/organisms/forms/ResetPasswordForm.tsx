'use client';
import { ResetPasswordDTO } from '@/proxy/auth/dto/reset-password.dto';

import React from 'react'
import Input from '../../atoms/Input';
import { CTA } from '@repo/ui';
import { resetPassword } from '@/proxy/auth/auth-functions';

interface ResetPasswordFormProps{
  token: string | undefined
}
function ResetPasswordForm({token}: ResetPasswordFormProps) {
  const [resetPasswordCredentials, setResetPasswordCredentials] = React.useState<ResetPasswordDTO>({
    newPassword: "",
    confirmNewPassword: ""
  })

  const isFormValid = Object.values(resetPasswordCredentials).every(value => value.trim() !== "") && resetPasswordCredentials.newPassword === resetPasswordCredentials.confirmNewPassword;

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  function setCredentialsInfo(e: React.ChangeEvent<HTMLInputElement>){
    setResetPasswordCredentials({...resetPasswordCredentials, [e.target.name]: e.target.value})
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    if(!token){
      setErrorMessage("Token de réinitialisation invalide.");
      return
    }

    const response = await resetPassword(token, resetPasswordCredentials);
    console.log('response', response)
    const result = await response.json();
    console.log('result', result);

    if(!response.ok){
      setErrorMessage(result.message)
    }

    if(response.ok){
      setSuccessMessage(result.message);
    }
  }

  return (
    <>
      {successMessage && <p className='p-3 bg-white text-green-500 rounded-md mb-3'>{successMessage}</p>}
      {errorMessage && <p className='p-3 bg-white text-red-500 rounded-md mb-3'>{errorMessage}</p>}
      <form 
        method="post"
        onSubmit={handleSubmit}
        className="max-w-96 mx-auto flex flex-col items-stretch gap-4"
      >
        <Input
          type="password"
          label="Nouveau mot de passe:"
          name="newPassword"
          placeholder="Entrez votre mot de passe"
          onChange={setCredentialsInfo}
        />

        <Input
          type="password"
          label="Confirmation du mot de passe:"
          name="confirmNewPassword"
          placeholder="Confirmez votre mot de passe"
          onChange={setCredentialsInfo}
        />
        
        <CTA
          type="button"
          color='primary'
          text='Réinitialiser mon mot de passe'
          disabled={!isFormValid}

        />
      </form>
    </>
  )
}

export default ResetPasswordForm