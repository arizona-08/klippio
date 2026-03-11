import { CTA } from '@repo/ui'
import React from 'react'

export default function page() {
  const plans = [
    { id: 'bgjksp-51a', name: 'Plan A' },
    { id: 'dddvds-71z', name: 'Plan B' },
    { id: 'vdzgta-23y', name: 'Plan C' }
  ]
  return (
    <main className='w-full grow-1 bg-blue-200'>
      <section className='max-w-7xl mx-auto py-12'>
        <h1 className='text-2xl font-semibold'>Bienvenue dans la partie application de Klippio</h1>

        <p className='mb-4'>Sélectionnez un plan pour commencer à ajouter des photos :</p>
        <CTA type='button' color='primary' text='Ajouter' />
        <ul className='list-disc list-inside mb-6'>
          {plans.map(plan => (
            <li key={plan.id}>
              <a href={`/app/plan?planId=${plan.id}`} className='text-blue-600 hover:underline'>
                {plan.name}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}