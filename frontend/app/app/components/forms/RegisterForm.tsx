'use client';
import { RegisterDTO } from '@/proxy/auth/dto/register.dto';
import { RegisterErrors } from '@/proxy/auth/errors/register.error';
import { register } from '@/proxy/auth/register';
import React from 'react'

function RegisterForm() {
  const [registerCredentials, setRegisterCredentials] = React.useState<RegisterDTO>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmation: "",
    role: "STANDARD"
  })

  function setCredentialsInfo(e: React.ChangeEvent<HTMLInputElement>){
    setRegisterCredentials({...registerCredentials, [e.target.name]: e.target.value})
  }

  const [errorMessages, setErrorMessages] = React.useState<RegisterErrors | null>(null)

  function createErrorObject(errors: string[]){
    let errorObj: Record<string, string[]> = {};
    for(const error of errors){
      const firstErrorWord = error.split(' ')[0]
      if(!errorObj[firstErrorWord]){
        errorObj[firstErrorWord] = []
        errorObj[firstErrorWord].push(error)
      }

      errorObj[firstErrorWord].push(error)
    }

    return errorObj;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const response = await register(registerCredentials);
    const result = await response.json();
    console.log(result);
    if(result.statusCode === 400){
      const errorObj = createErrorObject(result.message);
      // setErrorMessages(errorObj);
    }
  }

  return (
    <>
      <form method="post" onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 items-start mb-3'>
          <label htmlFor="firstname">Prénom:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            placeholder="John"
            className="p-3 bg-white"
            onChange={setCredentialsInfo}
          />
          {errorMessages && errorMessages.firstname && errorMessages.firstname.length > 0 && (
            <>
              {errorMessages.firstname.map(error => (
                <p className='text-red-500'>{error}</p>
              ))}
            </>
          )}
        </div>
        <div className='flex flex-col gap-2 items-start mb-3'>
          <label htmlFor="lastname">Nom:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            placeholder="Doe"
            className="p-3 bg-white"
            onChange={setCredentialsInfo}
          />
          {errorMessages && errorMessages.lastname && errorMessages.lastname.length > 0 && (
            <>
              {errorMessages.lastname.map(error => (
                <p className='text-red-500'>{error}</p>
              ))}
            </>
          )}          
        </div>
        <div className='flex flex-col gap-2 items-start mb-3'>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="johndoe@gmail.com"
            className="p-3 bg-white"
            onChange={setCredentialsInfo}
          />
          {errorMessages && errorMessages.email && errorMessages.email.length > 0 && (
            <>
              {errorMessages.email.map(error => (
                <p className='text-red-500'>{error}</p>
              ))}
            </>
          )}
        </div>
        <div className='flex flex-col gap-2 items-start mb-3'>
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="John"
            className="p-3 bg-white"
            onChange={setCredentialsInfo}
          />
          {errorMessages && errorMessages.password && errorMessages.password.length > 0 && (
            <>
              {errorMessages.password.map(error => (
                <p className='text-red-500'>{error}</p>
              ))}
            </>
          )}
        </div>
        <div className='flex flex-col gap-2 items-start mb-3'>
          <label htmlFor="confirmation">confirmation du mot de passe:</label>
          <input
            type="password"
            id="confirmation"
            name="confirmation"
            placeholder="John"
            className="p-3 bg-white"
            onChange={setCredentialsInfo}
          />
          {errorMessages && errorMessages.confirmation && errorMessages.confirmation.length > 0 && (
            <>
              {errorMessages.confirmation.map(error => (
                <p className='text-red-500'>{error}</p>
              ))}
            </>
          )}
        </div>
        <button type="submit">Envoyer</button>
      </form>
    </>
  )
}

export default RegisterForm