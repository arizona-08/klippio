import React from 'react'
import RegisterForm from '../../components/organisms/forms/RegisterForm'
import Logo from '@/app/components/atoms/Logo'

function page() {
  return (
    <main className='w-full px-4'>
      <section className='py-24 px-4 max-w-7xl mx-auto'>
        <div className="register-header flex flex-col items-center justify-center gap-4 mb-8">
          <Logo type='long' color='black' />
          <h1 className='text-2xl mt-8'>Inscription</h1>
        </div>

        <RegisterForm />
      </section>
    </main>
  )
}

export default page