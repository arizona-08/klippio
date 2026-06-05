import React from 'react'
import ResetPasswordForm from '../../components/organisms/forms/ResetPasswordForm'
import Logo from '@/app/components/atoms/Logo'

async function page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { token } = await searchParams
  return (
    <main className='w-full px-4'>
      <section className='py-24 max-w-7xl mx-auto'>
        <div className="reset-password-header flex flex-col items-center justify-center gap-4 mb-8">
          <Logo type='long' color='black' />
          <h1 className='text-2xl mt-8'>Réinitialisation du mot de passe</h1>
        </div>

        <ResetPasswordForm token={token}/>
      </section>
    </main>
  )
}

export default page