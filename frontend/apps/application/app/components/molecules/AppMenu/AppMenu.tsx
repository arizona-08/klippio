'use client'
import React from 'react'
import BurgerMenu from './BurgerMenu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/Context/AuthUserProvider'
import { logout } from '@/proxy/auth/logout'
import Logo from '@repo/ui/src/atoms/Logo'
import AppMenuLink from '../../atoms/AppMenuLink'

function AppMenu() {
  const {user, setUser} = useUser();

  const appMenuLinks = [
    {
      label: 'Mes Projets',
      href: '/dashbord/plans',
      iconSrc: "/icons/book_green.svg"
    },
    {
      label: 'Mes Archives',
      href: '/dashbord/plans',
      iconSrc: "/icons/archive_green.svg"
    },
    {
      label: 'Mon Équipe',
      href: '/dashbord/plans',
      iconSrc: "/icons/users_green.svg"
    }
  ]
  
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
      <div className="md:hidden relative">
        <div className="flex items-center gap-4 p-4 relative z-30 bg-white">
          <BurgerMenu handleOnClick={toggleActive} isActive={burgerActive}/>
          <Logo type='long' color='black' />
        </div>

        <div className={`absolute top-full bg-primary w-full min-w-80 left-0 ${burgerActive ? 'translate-y-0' : '-translate-y-full'} transition-all z-20`}>
          <div className='p-4 flex flex-col gap-3'>

            <ul className='flex flex-col gap-3'>
              {appMenuLinks.map((menuLink, index) => (
                <AppMenuLink
                  key={index}
                  menuLink={menuLink}
                />
              ))}
            </ul>
            {/* {!user && (
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
            )} */}
          </div>
        </div>

        {burgerActive && 
          <div className='layer absolute top-0 left-0 z-10 w-screen h-screen bg-black/25 backdrop-blur-sm'>
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