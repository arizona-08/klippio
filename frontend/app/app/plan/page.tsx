import React from 'react'
import PlanLoader from '../components/PlanLoader'
import Link from 'next/link'

async function page({searchParams}: {searchParams: Promise<Record<string, string | undefined>>}) {

  const {planId} = await searchParams

  return (
    <main className='w-full grow-1 p-4'>
      <section className='max-w-7xl mx-auto'>
        <header>
          <div className='mb-4'>
            <Link href='/app' className='text-blue-600 hover:underline'>&larr; Retour à la sélection des plans</Link>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Klippio</h1>
          <p className="text-gray-600 mt-2">Chargez un plan, puis cliquez dessus pour ajouter une photo à un emplacement précis.</p>
        </header>

        <PlanLoader planId={planId}/>

      </section>
    </main>
  )
}

export default page