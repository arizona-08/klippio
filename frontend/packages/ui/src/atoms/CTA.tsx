import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CTAProps {
  type: 'button' | 'link'
  text: string
  href?: string
  color: 'primary' | 'secondary' | 'danger'
  icon?: {
    src: string
    alt: string
  }
  onClick?: () => void
} 

function CTA({ type, text, href, color, icon, onClick }: CTAProps) {
  const baseClasses = `block px-4 py-2 rounded ${icon ? 'flex items-center justify-center gap-2' : ''}`
  const colorClasses = {
    primary: 'bg-primary text-white hover:bg-primary-hover transition-colors duration-150',
    secondary: 'border-1 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  if(type === 'button') {
    return (
      <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick}>
        {text}
        {icon && (
          <Image 
            src={icon.src}
            alt={icon.alt}
            width={24}
            height={24}
          />
        )}
      </button>
    )
  }

  if(type === 'link'){
    return (
      <Link href={href as string} className={`${baseClasses} ${colorClasses[color]}`}>
        {text}
        {icon && (
          <Image 
            src={icon.src}
            alt={icon.alt}
            width={24}
            height={24}
          />
        )}
      </Link>
    )
  }
}
 
export default CTA