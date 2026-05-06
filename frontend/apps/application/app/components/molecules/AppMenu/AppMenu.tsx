'use client'
import React from 'react'
import BurgerMenu from './BurgerMenu'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider'
import Logo from '@repo/ui/src/atoms/Logo'
import AppMenuLink from '../../atoms/AppMenuLink'
import Image from 'next/image'
import { logout } from '@/proxy/auth/auth-functions'
import { Archive, Book, LogInIcon, User, Users } from 'lucide-react'

function AppMenu() {
  const {user, setUser} = useUser();

  const appMenuLinks = [
    {
      label: 'Mes Projets',
      href: '/dashboard/projects',
      icon: <Book className='text-white'/>
    },
    {
      label: 'Mes Archives',
      href: '/dashboard/archives',
      icon: <Archive className='text-white'/>
    },
    {
      label: 'Mon Équipe',
      href: '/dashboard/teams',
      icon: <Users className='text-white'/>
    }
  ]
  
  const [burgerActive, setIsBurgerActive] = React.useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(true);

  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

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
      router.push('/auth/login');
    }
  }

  return (
    <div className=''>
      {/* Mobile menu */}
      <div className="lg:hidden relative">
        <div className="flex items-center justify-between bg-white relative z-50 p-4">
          <div className="flex items-center gap-4  ">
            <BurgerMenu handleOnClick={toggleBurgerActive} isActive={burgerActive}/>
            <Logo type='long' color='black' />
          </div>

          {/* Profile picture placeholder */}
          <div className="relative w-8 h-8 rounded-full bg-gray-300 z-50 px-4" onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}>
            <div className={`absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40 ${isProfileMenuOpen ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-150`}>
              <Link href="/profile" className='block px-4 py-2 text-sm hover:bg-gray-100'>Mon Profil</Link>
              <button onClick={() => {
                handleLogout();
                setIsProfileMenuOpen(false);
                }} className='flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500'>
                <LogInIcon className='text-red-500' size={16} />
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        <div className={`absolute top-full bg-primary w-full min-w-80 left-0 ${burgerActive ? 'translate-y-0' : '-translate-y-full'} transition-all z-40`}>
          <div className='p-4 flex flex-col gap-3'>

            <ul className='flex flex-col gap-3'>
              {appMenuLinks.map((menuLink, index) => (
                <AppMenuLink
                  key={index}
                  menuLink={menuLink}
                />
              ))}
            </ul>
          </div>
        </div>

        {burgerActive && 
          <div className='layer absolute top-0 left-0 z-30 w-screen h-screen bg-black/25 backdrop-blur-sm'>
          </div>
        }
      </div>

      
      {/* Desktop menu */}
      <div className={`hidden lg:flex flex-col gap-2 bg-primary h-screen py-6 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-14'} transition-all duration-150`}>

        <div className="top-header px-3">
          <div className={`header relative w-full shrink-0 flex items-center  ${isSidebarOpen ? 'justify-between' : 'group'}`}>
            <div className={`shrink-0 ${isSidebarOpen ? '' : 'group-hover:hidden'}`}>
              <Logo type={isSidebarOpen ? 'long' : 'icon'} color='white' />
            </div>

            <div className={`sticky top-0 right-0 z-10  hover:bg-white/20 p-1 rounded-md cursor-pointer transition-all duration-150 ${isSidebarOpen ? "" : "hidden group-hover:block"}`} onClick={toggleSidebar}>
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

          <div className="navlinks-container flex flex-col gap-4 mt-8 w-full overflow-x-hidden">
            <ul className={`flex flex-col items-start gap-3 min-w-40 shrink-0 `}>
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

        <div className="personal-infos  mt-auto text-white hover:bg-white/20 p-2 rounded-md transition-all duration-150">
          <Link href="/dashboard/profile" className='flex items-center gap-2'>
          
            <div className="pp-container w-10 h-10 shrink-0 rounded-full bg-gray-300">

            </div>

            <div className={`user-infos max-w-2/5 ${isSidebarOpen ? '' : 'hidden'}`}>
              
              <p className="line-clamp-1 text-sm font-medium">{user?.firstname} {user?.lastname}</p>
              <p className="line-clamp-1 text-xs opacity-85">{user?.email}</p>
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
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AppMenu