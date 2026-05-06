'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

export type AppMenuLinkType = {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AppMenuLinkProps {
  menuLink: AppMenuLinkType;
  hideText?: boolean;
}

function AppMenuLink({ menuLink, hideText }: AppMenuLinkProps) {
  const { label, href, icon } = menuLink;
  const pathname = usePathname();

  return (
    <li className="inline-block shrink-0 w-full hover:bg-white/20 p-1 rounded-md">
      <Link href={href} className='flex items-center gap-4'>
        <div className="w-[30px] h-[30px] rounded-sm flex justify-center items-center">
          {icon}
        </div>

        <span className={`${hideText ? 'invisible opacity-0 hidden' : 'inline text-white'} transition-all duration-150`}>{label}</span>
      </Link>
    </li>
  )
}

export default AppMenuLink