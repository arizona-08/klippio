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
import { Archive, Book, LogInIcon, LogOut, User, Users } from 'lucide-react'
import { useSidebarStore } from '@/stores/SidebarStore'
import useViewportWidth from '@/app/hooks/useViewportWidth'

function AppMenu() {
  useViewportWidth()
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
  // const [isSidebarOpen, setIsSidebarOpen] = React.useState<boolean>(false);

  const { isSidebarOpen, toggleSidebar } = useSidebarStore();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  function toggleBurgerActive(){
    setIsBurgerActive(!burgerActive);
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

          {/* Profile picture + menu */}
          <div className="relative z-50">
            <div
              className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-300 cursor-pointer"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            >
              {user && user.profilePicture && (
                <img
                  src={user.profilePicture.url}
                  alt="Apercu de la photo de profil"
                  className="absolute left-1/2 top-1/2 select-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${user.profilePicture?.offsetX}px, ${user.profilePicture?.offsetY}px) scale(${user.profilePicture?. zoom})`
                  }}
                  draggable={false}
                />
              )}
            </div>

            <div className={`absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-md shadow-lg w-40 ${isProfileMenuOpen ? "visible opacity-100" : "invisible opacity-0"} transition-all duration-150`}>
              <Link href="/dashboard/profile" className='flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100'> <User className='w-4 h-4'/> Mon Profil</Link>
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
      <div className={`hidden lg:flex flex-col gap-2 bg-primary h-screen py-6 shrink-0 ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-150`}>

        <div className="top-header px-3">
          <div className={`header relative w-full shrink-0 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center group'}`}>
            <div className={`shrink-0 ${isSidebarOpen ? '' : 'group-hover:hidden'}`}>
              <Logo type={isSidebarOpen ? 'long' : 'icon'} color='white' />
            </div>

            <div className={`sticky top-0 right-0 z-10  hover:bg-white/20 p-1 rounded-md cursor-pointer transition-all duration-150 ${isSidebarOpen ? "" : "hidden group-hover:block"}`} >
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

          <div className="navlinks-container flex flex-col gap-4 mt-8 w-full min-w-0 border-b border-white/60 pb-4">
            <ul className={`flex flex-col gap-3 min-w-0 ${isSidebarOpen ? 'items-start' : 'items-center'}`}>
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

        <div className={`relative personal-infos mt-auto text-white px-2 rounded-md transition-all duration-150 ${isSidebarOpen ? '' : 'flex justify-center'} group`}>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white rounded-md w-40 flex items-center justify-center gap-4 text-xs text-red-500 font-medium px-2 py-3 cursor-pointer opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-150" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            <p className={`${isSidebarOpen ? 'inline-block' : 'hidden'}`}>Me déconnecter</p>
          </div>
          <Link href="/dashboard/profile" className={`hover:bg-white/20 p-2 rounded-md flex items-center gap-4 ${isSidebarOpen ? '' : 'justify-center w-full'}`}>
          
            <div className="pp-container relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-300">
              {user && user.profilePicture && (
                <img
                  src={user.profilePicture.url}
                  alt="Apercu de la photo de profil"
                  className="absolute left-1/2 top-1/2 select-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${user.profilePicture?.offsetX}px, ${user.profilePicture?.offsetY}px) scale(${user.profilePicture?. zoom})`
                  }}
                  draggable={false}
                />
              )}
            </div>

            <div className={`user-infos max-w-2/5 ${isSidebarOpen ? '' : 'hidden'}`}>
              
              <p className="line-clamp-1 font-medium">{user?.firstname} {user?.lastname}</p>
              <p className="line-clamp-1 text-sm opacity-85">{user?.email}</p>
            </div>

          </Link>
        </div>
      </div>
    </div>
  )
}

export default AppMenu