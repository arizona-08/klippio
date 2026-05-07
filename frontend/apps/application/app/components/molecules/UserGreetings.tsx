'use client'
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider'
import React from 'react'

function UserGreetings() {
  const {user} = useUser()
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-sm text-emerald-700">
      Bonjour {user?.firstname || 'Utilisateur'}!
    </span>
  )
}

export default UserGreetings