import Link from 'next/link'
import React from 'react'

function MarketingHeader() {
  return (
    <header className="w-full bg-green-200 p-4">
      <div className='wrapper max-w-7xl mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>Klippio</Link>

        <Link href="/app/auth/login" className='p-3 bg-purple-500'>Me connecter</Link>
      </div>
    </header>
  )
}

export default MarketingHeader