import React from 'react'
import AppMenu from '../components/molecules/AppMenu/AppMenu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen lg:flex-row">
        <AppMenu />
        <main className='w-full'>
          {children}
        </main>
      </div>
    </>
  )
}

export default DashboardLayout