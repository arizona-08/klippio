'use client'
import React from 'react'
import BurgerMenu from './BurgerMenu'
import Link from 'next/link'

function AppMenu() {
  const [burgerActive, setIsBurgerActive] = React.useState<boolean>(false);
  function toggleActive(){
    setIsBurgerActive(!burgerActive);
  }
  
  return (
    <div className=''>
      <div className="md:hidden">
        <BurgerMenu handleOnClick={toggleActive} isActive={burgerActive}/>

        <div className={`absolute top-0 bg-white h-screen w-full min-w-80 max-w-96 right-0 ${burgerActive ? 'translate-x-0' : 'translate-x-full'} transition-all z-20`}>
          <div className='mt-32 p-4 flex flex-col gap-3'>
            <Link href="/app/auth/register" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>M'inscrire</Link>
            <Link href="/app/auth/login" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-purple-500'>Me connecter</Link>
          </div>
        </div>

        {burgerActive && 
          <div className='layer absolute top-0 left-0 w-screen h-screen bg-black/75'>
          </div>
        }
      </div>

      <div className='hidden md:flex gap-2'>
        <Link href="/app/auth/register" onClick={toggleActive} className='p-3 bg-pink-500 rounded-md'>M'inscrire</Link>
        <Link href="/app/auth/login" onClick={toggleActive} className='p-3 bg-purple-500 rounded-md'>Me connecter</Link>
      </div>
    </div>
  )
}

export default AppMenu