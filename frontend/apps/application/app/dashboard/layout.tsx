import React from 'react'
import AppMenu from '../components/molecules/AppMenu/AppMenu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <>
      <div className="flex flex-col h-screen lg:flex-row overflow-hidden">
        <AppMenu />
        <main className='w-full flex-1 min-h-0 overflow-y-auto relative bg-white lg:border-l lg:border-gray-100'>
          {children}
        </main>
      </div>
    </>
  )
}

export default DashboardLayout