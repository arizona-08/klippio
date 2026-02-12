import React from 'react'
import AppFooter from '../components/layouts/AppFooter'

interface LayoutProps {
  children: React.ReactNode
}
function layout({ children }: LayoutProps) {
  return (
    <main className='flex flex-col items-center min-h-screen relative overflow-x-hidden'>
      <div className='w-full flex-1'>
        {children}
      </div>
      {/* <AppFooter /> */}
    </main>
  )
}

export default layout