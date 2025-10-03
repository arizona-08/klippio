'use client';
import { LoginDTO } from '@/proxy/auth/dto/login.dto';
import { login } from '@/proxy/auth/login';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useUser } from '../../Context/AuthUserProvider';

function LoginForm() {

  const {setUser} = useUser();
  const [loginCredentials, setLoginCredentials] = React.useState<LoginDTO>({
    email: "",
    password: ""
  })

  const [errorMessage, setErrorMessage] = React.useState<string | null>();
  const router = useRouter();

  function setCredentialsInfo(e: React.ChangeEvent<HTMLInputElement>){
    setLoginCredentials({...loginCredentials, [e.target.name]: e.target.value})
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    const response = await login(loginCredentials);
    const result = await response.json();

    if(response.ok){
      setUser(result.user)
      router.push('/app')
    } else {
      setErrorMessage(result.message);
    }
  }

  return (
    <>
      <form className='' onSubmit={handleSubmit}>
        {errorMessage && (<p className='text-red-500'>{errorMessage}</p>)}
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
        </div>
        <button type="submit" className='inline-block p-3 bg-orange-500'>Me connecter</button>
        <p className='mt-5'>Pas encore de compte ? <Link href='/app/auth/register' className='hover:underline hover:text-blue-500'>Me créer un compte</Link></p>
        <p className='mt-2'><Link href="/app/auth/forgot-password" className='hover:underline hover:text-blue-500'>Mot de passe oublié ?</Link></p>
      </form>
    </>
  )
}

export default LoginForm