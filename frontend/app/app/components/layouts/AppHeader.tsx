'use client';
import Link from 'next/link'
import React from 'react'
import { useUser } from '../../Context/AuthUserProvider'
import { logout } from '@/proxy/auth/logout';
import { useRouter } from 'next/navigation';

function AppHeader() {
  const {user, setUser} = useUser();
  const router = useRouter();

  async function handleLogout(){
    const response = await logout();

    if(response.ok){
      setUser(undefined);
      router.push('/app/auth/login');
    }
  }

  return (
    <header className="w-full bg-green-200 p-4">
      <div className='wrapper max-w-7xl mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>Klippio</Link>
        {user && <button className='inline-block bg-red-500 text-white p-3 rounded-xl' onClick={handleLogout}>Me déconnecter</button>}
        
      </div>
    </header>
  )
}

export default AppHeader