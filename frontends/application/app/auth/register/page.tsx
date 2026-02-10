import React from 'react'
import RegisterForm from '../../components/forms/RegisterForm'

function page() {
  return (
    <main className='w-full grow-1 bg-blue-200'>
      <section className='py-12 px-4 max-w-7xl mx-auto'>
        <h1 className='text-3xl font-semibold mb-4'>Inscription</h1>
        <RegisterForm />
      </section>
    </main>
  )
}

export default page