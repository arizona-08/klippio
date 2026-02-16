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
    <li className="inline-block shrink-0 w-full">
      <Link href={href} className='flex items-center gap-4'>
        <div className="w-[30px] h-[30px] bg-white rounded-sm flex justify-center items-center">
          <Image
            src={iconSrc}
            alt={`${label} icon`}
            width={18}
            height={18}
          />
        </div>

        <span className={`${hideText ? 'invisible opacity-0 hidden' : 'inline text-white'} transition-all duration-150`}>{label}</span>
      </Link>
    </li>
  )
}

export default AppMenuLink