'use client';
import { LoginDTO } from '@/proxy/auth/dto/login.dto';
import { login } from '@/proxy/auth/login';
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useUser } from '../../../Context/AuthContext/AuthUserProvider';
import Input from '../../atoms/Input';
import { CTA } from '@repo/ui';

function LoginForm() {

  const {setUser} = useUser();
  const [loginCredentials, setLoginCredentials] = React.useState<LoginDTO>({
    email: "",
    password: ""
  })

  const isFormValid = Object.values(loginCredentials).every(value => value.trim() !== "");

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
      router.push('/')
    } else {
      setErrorMessage(result.message);
    }
  }

  return (
    <>
      <div className='max-w-96 flex flex-col justify-center items-stretch gap-8 mx-auto'>
        <form className='flex flex-col justify-center items-stretch gap-4' onSubmit={handleSubmit}>
          {errorMessage && (<p className='text-red-500'>{errorMessage}</p>)}
          <Input
            type='email'
            label="Email:"
            name="email"
            placeholder="johndoe@gmail.com"
            value={loginCredentials.email}
            onChange={setCredentialsInfo}
          />
          
          <Input
            type='password'
            label="Mot de passe:"
            name="password"
            placeholder="Entrez votre mot de passe"
            value={loginCredentials.password}
            onChange={setCredentialsInfo}
          />

          <CTA type='button' color='primary' text='Connexion' disabled={!isFormValid} />
    
          <p className='mt-2'><Link href="/auth/forgot-password" className='hover:underline hover:text-primary'>Mot de passe oublié ?</Link></p>
          <p className='mt-2'>Pas encore de compte ? <Link href='/auth/register' className='hover:underline hover:text-primary'>Me créer un compte</Link></p>
        </form>

        <div className='relative'>
          <hr className='w-full text-stroke'></hr>
          <p className='text-stroke absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4'>Ou</p>
        </div>

        <div className="google-auth flex flex-col gap-4 items-stretch">
          <CTA
            type='button'
            color='secondary'
            text='Se connecter avec Google'
            icon={{
              src: '/logos/brand_logos/google.svg',
              alt: 'Google icon'
            }}
            onClick={() => router.push('/auth/google')}
          />
        </div>
      </div>
    </>
  )
}

export default LoginForm 