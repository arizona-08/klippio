import React from 'react'
import Image from 'next/image'

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
        width={type === 'long' ? 100 : 30}
        height={30}
      />
    </div>
  )
}

export default Logo