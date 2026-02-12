import React from 'react'
import ForgotPasswordForm from '../../components/organisms/forms/ForgotPasswordForm'
import Logo from '@repo/ui/src/atoms/Logo'

function page() {
  return (
    <main className='w-full px-4'>
      <section className='py-24 max-w-7xl mx-auto'>
        <div className="login-header flex flex-col items-center justify-center gap-4 mb-8">
          <Logo type='long' color='black' />
          <h1 className="text-2xl mt-8">Mot de passe oublié</h1>
        </div>

        <p className='max-w-96 mx-auto mb-6'>Entrez votre mail pour demander un mail de réinitialisation de mot de passe.</p>
        <ForgotPasswordForm />

        
      </section>
    </main>
  )
}

export default page