'use client'
import React from 'react'
import BurgerMenu from './BurgerMenu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/Context/AuthUserProvider'
import { logout } from '@/proxy/auth/logout'

function AppMenu() {
  const {user, setUser} = useUser();

  const [burgerActive, setIsBurgerActive] = React.useState<boolean>(false);
  function toggleActive(){
    setIsBurgerActive(!burgerActive);
  }

  const router = useRouter();
  
  async function handleLogout(){
    const response = await logout();

    if(response.ok){
      setUser(undefined);
      router.push('/');
    }
  }
  
  return (
    <div className=''>
      {/* Mobile menu */}
      <div className="md:hidden">
        <BurgerMenu handleOnClick={toggleActive} isActive={burgerActive}/>

        <div className={`absolute top-0 bg-white h-screen w-full min-w-80 max-w-96 right-0 ${burgerActive ? 'translate-x-0' : 'translate-x-full'} transition-all z-20`}>
          <div className='mt-32 p-4 flex flex-col gap-3'>
            {!user && (
              <>
                <Link href="/auth/register" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>M'inscrire</Link>
                <Link href="/auth/login" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-purple-500'>Me connecter</Link>
              </>
            )}

            {user && (
              <>
                <Link href="/" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>Mes plans</Link>
                <button
                  className='inline-block bg-slate-200 border border-slate-500 rounded-md p-2 text-red-500'
                  onClick={handleLogout}
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>

        {burgerActive && 
          <div className='layer absolute top-0 left-0 w-screen h-screen bg-black/75'>
          </div>
        }
      </div>

        {/* Desktop menu */}
      <div className='hidden md:flex gap-2'>
            {!user && (
              <>
                <Link href="/auth/register" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>M'inscrire</Link>
                <Link href="/auth/login" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-purple-500'>Me connecter</Link>
              </>
            )}

            {user && (
              <>
                <Link href="/" onClick={toggleActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>Mes plans</Link>
                <button
                  className='inline-block bg-white border border-slate-300 rounded-md p-2 text-red-500'
                  onClick={() => {
                    handleLogout();
                    toggleActive();
                  }}
                >
                  Déconnexion
                </button>
              </>
            )}
      </div>
    </div>
  )
}

export default AppMenu