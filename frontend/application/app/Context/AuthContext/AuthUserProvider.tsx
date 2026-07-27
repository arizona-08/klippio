'use client';
import React, { useContext, useEffect } from 'react'
import { AuthUserContext, User } from './AuthUserContext'
import { getAuthUser } from '@/proxy/auth/auth-functions';


interface AuthUserProps{
  children: React.ReactNode
}

function AuthUserProvider({ children }: AuthUserProps) {
  const [user, setUser] = React.useState<User | undefined>(undefined)

  useEffect(() => {
    async function fetchAuthUser(){
      const response = await getAuthUser();
      const result = await response.json();
      // console.log(result);
      if(response.ok){
        setUser({...result});
      } else {
        setUser(undefined);
      }
    }

    fetchAuthUser();
  }, [])

  return (
    <AuthUserContext.Provider value={{user, setUser}}>
      {children}    
    </AuthUserContext.Provider>
  )
}

export function useUser(){
  const context = useContext(AuthUserContext);
  if(context === undefined){
    throw new Error('useUser doit être utilisé dans le AuthUserProvider')
  }
  return context;
}

export default AuthUserProvider