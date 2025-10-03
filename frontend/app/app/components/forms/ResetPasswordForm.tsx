import { ResetPasswordDTO } from '@/proxy/auth/dto/reset-password.dto';
import { resetPassword } from '@/proxy/auth/reset-password';
import React from 'react'

interface ResetPasswordFormProps{
  token: string | undefined
}
function ResetPasswordForm({token}: ResetPasswordFormProps) {
  const [resetPasswordCredentials, setResetPasswordCredentials] = React.useState<ResetPasswordDTO>({
    newPassword: "",
    confirmNewPassword: ""
  })

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
    const result = await response.json();

    if(result.statusCode === 200){
      setSuccessMessage(result.message);
    }
  }




  return (
    <>
      {successMessage && <p className='p-3 bg-white text-green-500 rounded-md mb-3'>{successMessage}</p>}
      <form method="post" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 items-start mb-3'>
            <label htmlFor="newPassword">Nouveau mot de passe:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Entrez votre nouveau mot de passe"
              required
              className="p-3 bg-white"
              onChange={setCredentialsInfo}
            />
          </div>
          <div className='flex flex-col gap-2 items-start mb-3'>
            <label htmlFor="confirmNewPassword">Confirmation du mot de passe:</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Entrez votre nouveau mot de passe"
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

export default ResetPasswordForm