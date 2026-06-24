'use client';
import { ForgotPasswordDTO } from '@/proxy/auth/dto/forgot-password.dto'

import React from 'react'
import Input from '../../atoms/Input';

import { forgotPassword } from '@/proxy/auth/auth-functions';
import CTA from '../../atoms/CTA';

function ForgotPasswordForm() {
  const [forgotPasswordCredentials, setForgotPasswordCredentials] = React.useState<ForgotPasswordDTO>({
    email: ""
  })

  function setCredentialsInfo(e: React.ChangeEvent<HTMLInputElement>){
    setForgotPasswordCredentials({...forgotPasswordCredentials, [e.target.name]: e.target.value})
  }

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [isNoticeShown, setIsNoticeShown] = React.useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const response = await forgotPassword(forgotPasswordCredentials);
    const result = await response.json();

    if(response.ok){
      setSuccessMessage(result.message)
    }

    setIsNoticeShown(true);
  }

  return (
    <>
      {successMessage && <p className='p-3 bg-white text-green-500 rounded-md mb-3'>{successMessage}</p>}
      <form className="max-w-96 mx-auto flex flex-col items-stretch gap-4" method="post" onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email"
          name="email"
          placeholder="Entrez votre email"
          value={forgotPasswordCredentials.email}
          onChange={setCredentialsInfo}
        />
          <CTA
            type="button"
            color='primary'
            text='Envoyer'
            disabled={!forgotPasswordCredentials.email}
          />

          {isNoticeShown && (
            <p className='mt-6'>Vous recevrez un email avec les instructions pour réinitialiser votre mot de passe si votre adresse mail est relié à un compte.</p>
          )}
      </form>
    </>
  )
}

export default ForgotPasswordForm