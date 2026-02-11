import React from 'react'
import ForgotPasswordForm from '../../components/organisms/forms/ForgotPasswordForm'

function page() {
  return (
    <main className='w-full grow-1 bg-blue-200'>
      <section className='py-12 max-w-7xl mx-auto'>
        <h1 className='text-2xl font-bold'>J'ai oublié mon mot de passe</h1>

        <p>Entrez votre email pour recevoir un mail de réinitialisation de mot de passe</p>

        <ForgotPasswordForm />
      </section>
    </main>
  )
}

export default page