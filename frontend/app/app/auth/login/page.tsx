import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <main className='w-full grow-1 bg-blue-200'>
      <section className='py-12 max-w-7xl mx-auto'>
        <p>login</p>
        <p>Pas encore de compte ? <Link href='/app/auth/register' className='hover:underline hover:text-blue-500'>Me créer un compte</Link></p>
      </section>
    </main>
  )
}

export default page