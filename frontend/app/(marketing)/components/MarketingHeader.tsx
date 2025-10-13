import AppMenu from '@/app/components/AppMenu/AppMenu'
import Link from 'next/link'
import React from 'react'

function MarketingHeader() {
  return (
    <header className="w-full bg-green-200 p-4">
      <div className='wrapper max-w-7xl mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>Klippio</Link>

        <AppMenu />
      </div>
    </header>
  )
}

export default MarketingHeader