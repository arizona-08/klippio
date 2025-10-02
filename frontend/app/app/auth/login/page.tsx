import Link from 'next/link'
import React from 'react'
import LoginForm from '../../components/forms/LoginForm'

function page() {
  return (
    <main className='w-full grow-1 px-4 bg-blue-200'>
      <section className='py-12 max-w-7xl mx-auto'>
        <p>Connexion</p>

        <LoginForm />
      </section>
    </main>
  )
}

export default page