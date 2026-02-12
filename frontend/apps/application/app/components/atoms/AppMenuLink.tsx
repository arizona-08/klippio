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
}

function AppMenuLink({ menuLink }: AppMenuLinkProps) {
  const { label, href, iconSrc } = menuLink;
  return (
    <li className="">
      <Link href={href} className='flex items-center gap-4'>
        <div className="w-6 h-6 bg-white rounded-sm flex justify-center items-center">
          <Image
            src={iconSrc}
            alt={`${label} icon`}
            width={18}
            height={18}
          />
        </div>

        <span className="text-white">{label}</span>
      </Link>
    </li>
  )
}

export default AppMenuLink