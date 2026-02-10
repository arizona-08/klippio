'use client';
import { ForgotPasswordDTO } from '@/proxy/auth/dto/forgot-password.dto'
import { forgotPassword } from '@/proxy/auth/forgot-password';
import React from 'react'

function ForgotPasswordForm() {
  const [forgotPasswordCredentials, setForgotPasswordCredentials] = React.useState<ForgotPasswordDTO>({
    email: ""
  })

  function setCredentialsInfo(e: React.ChangeEvent<HTMLInputElement>){
    setForgotPasswordCredentials({...forgotPasswordCredentials, [e.target.name]: e.target.value})
  }

  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const response = await forgotPassword(forgotPasswordCredentials);
    const result = await response.json();

    if(response.ok){
      setSuccessMessage(result.message)
    }
  }

  return (
    <>
      {successMessage && <p className='p-3 bg-white text-green-500 rounded-md mb-3'>{successMessage}</p>}
      <form method="post" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 items-start mb-3'>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="johndoe@gmail.com"
              required
              className="p-3 bg-white"
              onChange={setCredentialsInfo}
            />
          </div>
          <button type="submit" className='p-3 bg-orage-400'>Envoyer</button>
      </form>
    </>
  )
}

export default ForgotPasswordForm