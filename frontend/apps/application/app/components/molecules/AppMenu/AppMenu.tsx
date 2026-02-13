'use client'
import React from 'react'
import BurgerMenu from './BurgerMenu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/Context/AuthUserProvider'
import { logout } from '@/proxy/auth/logout'
import Logo from '@repo/ui/src/atoms/Logo'
import AppMenuLink from '../../atoms/AppMenuLink'
import Image from 'next/image'

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);

  function toggleBurgerActive(){
    setIsBurgerActive(!burgerActive);
  }

  function toggleSidebar(){
    setIsSidebarOpen(!isSidebarOpen);
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
      <div className="lg:hidden relative">
        <div className="flex items-center gap-4 p-4 relative z-30 bg-white">
          <BurgerMenu handleOnClick={toggleBurgerActive} isActive={burgerActive}/>
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
                <Link href="/auth/register" onClick={toggleBurgerActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>M'inscrire</Link>
                <Link href="/auth/login" onClick={toggleBurgerActive} className='inline-block p-3 text-center rounded-lg bg-purple-500'>Me connecter</Link>
              </>
            )}

            {user && (
              <>
                <Link href="/" onClick={toggleBurgerActive} className='inline-block p-3 text-center rounded-lg bg-pink-500'>Mes plans</Link>
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
      <div className={`hidden lg:flex flex-col gap-2 bg-primary h-screen py-6 px-3 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all `}>

        <div className="top-header">
          <div className={`header shrink-0 flex items-center justify-between ${isSidebarOpen ? '' : 'group'}`}>
            <div className={`${isSidebarOpen ? '' : 'group-hover:hidden'}`}>
              <Logo type={isSidebarOpen ? 'long' : 'icon'} color='white' />
            </div>

            <div className={`hover:bg-white/20 p-1 rounded-md cursor-pointer transition-all duration-150 ${isSidebarOpen ? "" : "hidden group-hover:block"}`} onClick={toggleSidebar}>
              <Image
                src="/icons/sidebar.svg"
                alt="close icon"
                width={22}
                height={22}
                className='cursor-pointer'
                onClick={toggleSidebar}
              />
            </div>
          </div>

          <div className="navlinks-container shrink-0 min-w-64 flex flex-col gap-4 mt-8">
            <ul className='flex flex-col items-start gap-3'>
                {appMenuLinks.map((menuLink, index) => (
                  <AppMenuLink
                    key={index}
                    menuLink={menuLink}
                    hideText={!isSidebarOpen}
                  />
                ))}
              </ul>
          </div>
        </div>

        <div className="personal-infos flex items-center gap-2 mt-auto text-white hover:bg-white/20 p-2 rounded-md transition-all duration-150">
          <div className="pp-container w-10 h-10 shrink-0 rounded-full bg-gray-300">

          </div>

          <div className={`user-infos max-w-2/5 ${isSidebarOpen ? '' : 'hidden'}`}>
            <p className="line-clamp-1 text-sm font-medium">Jonathan Assi</p>
            <p className="line-clamp-1 text-xs opacity-85">assijonathan2@gmail.com</p>
          </div>

          <div className={`logout-button ml-auto bg-white p-1 rounded-md ${isSidebarOpen ? '' : 'hidden'}`}>
            <Image
              src="/icons/logout.svg"
              alt="logout icon"
              width={16}
              height={16}
              className='cursor-pointer'
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppMenu