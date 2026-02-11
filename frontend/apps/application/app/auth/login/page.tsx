import React from 'react'
import LoginForm from '../../components/organisms/forms/LoginForm'
import Logo from '@repo/ui/src/atoms/Logo'

function page() {
  return (
    <main className='w-full px-4 '>
      <section className='py-24 max-w-7xl mx-auto'>
        <div className="login-header flex flex-col items-center justify-center gap-4 mb-8">
          <Logo type='long' color='black' />
          <h1 className="text-2xl mt-8">Connexion</h1>
        </div>

        <LoginForm />
      </section>
    </main>
  )
}

export default page