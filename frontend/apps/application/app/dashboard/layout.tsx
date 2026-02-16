import React from 'react'
import AppMenu from '../components/molecules/AppMenu/AppMenu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

function DashboardLayout({children}: DashboardLayoutProps) {
  return (
    <>
      <div className="flex flex-col gap-4 h-screen lg:flex-row overflow-hidden">
        <AppMenu />
        <main className='w-full overflow-y-auto relative'>
          {children}
        </main>
      </div>
    </>
  )
}

export default DashboardLayout