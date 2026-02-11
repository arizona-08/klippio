import Image from 'next/image'
import React from 'react'

interface LogoProps {
  type: 'long' | 'icon'
  color: 'black' | 'white'
}
function Logo({ type, color }: LogoProps) {
  return (
    <div className="logo-container">
      <Image
        src={`/logos/logo_${type}_${color}.svg`}
        alt="Klippio Logo"
        width={type === 'long' ? 100 : 40}
        height={40}
      />
    </div>
  )
}

export default Logo