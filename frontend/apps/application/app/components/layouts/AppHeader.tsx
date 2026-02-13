'use client';
import Link from 'next/link'
import React from 'react'
import AppMenu from '@/app/components/molecules/AppMenu/AppMenu';

function AppHeader() {

  return (
    <header className="w-full p-4">
      <div className='wrapper max-w-7xl mx-auto flex justify-between items-center'>
        {/* <Link href='/' className='text-2xl font-bold'>Klippio</Link> */}
        <AppMenu />
      </div>
    </header>
  )
}

export default AppHeader