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
    <li className={`w-full shrink-0 hover:bg-white/20 p-1 rounded-md ${hideText ? 'flex justify-center' : ''}`}>
      <Link href={href} className={`flex items-center w-full ${hideText ? 'justify-center gap-0' : 'gap-4'}`}>
        <div className="w-[30px] h-[30px] rounded-sm flex justify-center items-center">
          {icon}
        </div>

        <span
          className={`inline-block overflow-hidden whitespace-nowrap text-white transition-all duration-200 ${
            hideText ? 'max-w-0 opacity-0 translate-x-2' : 'max-w-[180px] opacity-100 translate-x-0'
          }`}
        >
          {label}
        </span>
      </Link>
    </li>
  )
}

export default AppMenuLink