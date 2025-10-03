import React from 'react'
import ResetPasswordForm from '../../components/forms/ResetPasswordForm'

async function page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { token } = await searchParams
  return (
    <main className='w-full grow-1 bg-blue-200'>
      <section className='py-12 max-w-7xl mx-auto'>
        <h1 className='text-2xl'>reset-password</h1>

        <ResetPasswordForm token={token}/>
      </section>
    </main>
  )
}

export default page