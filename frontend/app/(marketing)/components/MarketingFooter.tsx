import Link from 'next/link'
import React from 'react'

function MarketingFooter() {
  return (
    <footer className="w-full bg-green-200 p-4">
      <div className='wrapper max-w-7xl mx-auto'>
        <Link href='/' className='text-2xl font-bold'>Klippio</Link>
      </div>
    </footer>
  )
}

export default MarketingFooter