import React from 'react'

async function page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { token } = await searchParams
  return (
    <main className='w-full grow-1 bg-blue-200'>
      <section className='py-12 max-w-7xl mx-auto'>
        <p>reset-password</p>
      </section>
    </main>
  )
}

export default page