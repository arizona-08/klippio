import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export type AppMenuLinkType = {
  label: string;
  href: string;
  iconSrc: string;
}

interface AppMenuLinkProps {
  menuLink: AppMenuLinkType;
  hideText?: boolean;
}

function AppMenuLink({ menuLink, hideText }: AppMenuLinkProps) {
  const { label, href, iconSrc } = menuLink;
  return (
    <li className="inline-block">
      <Link href={href} className='flex items-center gap-4'>
        <div className="w-6 h-6 bg-white rounded-sm flex justify-center items-center">
          <Image
            src={iconSrc}
            alt={`${label} icon`}
            width={18}
            height={18}
          />
        </div>

        <span className={`${hideText ? 'hidden' : 'inline text-white'} transition-all duration-150`}>{label}</span>
      </Link>
    </li>
  )
}

export default AppMenuLink