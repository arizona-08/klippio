import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CTAProps {
  type: 'button' | 'link'
  text: string
  href?: string
  color: 'primary' | 'secondary' | 'gray' | 'danger' | 'danger_reverse'
  icon?: React.ReactNode,
  className?: string
  iconImage?: {
    src: string,
    alt: string
  }
  iconReverse?: boolean
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  isLoading?: boolean
} 

function CTA({ type, text, href, color, icon, iconImage, iconReverse, className, onClick, disabled, isLoading = false }: CTAProps) {
  const baseClasses = `block px-4 py-2 rounded font-medium cursor-pointer ${icon || iconImage ? 'flex items-center justify-center gap-2' : ''} ${iconReverse ? 'flex-row-reverse' : ''} ${className || ''}`;
  const colorClasses = {
    primary: `bg-primary text-white hover:bg-primary-hover transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    secondary: `border-1 border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    gray: `bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger: `bg-red-500 text-white hover:bg-red-600 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`,
    danger_reverse: `bg-white text-red-500 border-1 border-red-500 hover:bg-red-500 hover:text-white transition-colors duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ' cursor-pointer'}`,
  }

  if(type === 'button') {
    return (
      <button className={`${baseClasses} ${colorClasses[color]}`} onClick={onClick} disabled={disabled} aria-busy={isLoading}>
        {isLoading ? (
          <>
            <span className='flex items-center justify-center'>
              
              {/* spin animation */}
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* faint full circle border */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
                {/* arc stroke that gives spinning border effect */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-75" fill="none" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" />
              </svg>
            </span>
          </>
        ) : (
          <>
            {text}
            {icon}
            {iconImage && <Image src={iconImage.src} alt={iconImage.alt} width={20} height={20} />}
          </>

        )}
      </button>
    )
  }

  if(type === 'link'){
    return (
      <Link href={href as string} className={`${baseClasses} ${colorClasses[color]}`} >
        {isLoading ? (
          <>
            <span className='flex items-center justify-center'>
              
              {/* spin animation */}
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {/* faint full circle border */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" fill="none" />
                {/* arc stroke that gives spinning border effect */}
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-75" fill="none" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="60" />
              </svg>
            </span>
          </>
        ) : (
          <>
            {text}
            {icon}
            {iconImage && <Image src={iconImage.src} alt={iconImage.alt} width={20} height={20} />}
          </>
        )}
      </Link>
    )
  }
}
 
export default CTA