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
  iconReverse?: boolean
  onClick?: () => void
  disabled?: boolean
} 

function CTA({ type, text, href, color, icon, iconReverse, onClick, disabled }: CTAProps) {
  const baseClasses = `block px-4 py-2 rounded ${icon ? 'flex items-center justify-center gap-2' : ''} ${iconReverse ? 'flex-row-reverse' : ''}`;
  const colorClasses = {
    primary: `bg-primary text-white hover:bg-primary-hover transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `border-1 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-500 text-white hover:bg-red-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
  }

  if(type === 'button') {
    return (
      <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick} disabled={disabled}>
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
      <Link href={href as string} className={`${baseClasses} ${colorClasses[color]}`} >
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