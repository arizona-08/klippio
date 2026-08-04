'use client'
import { useUser } from '@/app/Context/AuthContext/AuthUserProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { isAdministrativeRole } from '@/app/utils/roles';

export type AppMenuLinkType = {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface AppMenuLinkProps {
  menuLink: AppMenuLinkType;
  hideText?: boolean;
  onClose(): void;
}

function AppMenuLink({ menuLink, hideText, onClose }: AppMenuLinkProps) {
  const { label, href, icon } = menuLink;
  const pathname = usePathname();
  // const {user} = useUser();
  // const isAdmin = isAdministrativeRole(user?.role);

  const pathNameParts = pathname.split('/');
  const hrefParts = href.split('/');
  const isActive = pathNameParts[pathNameParts.length - 1] === hrefParts[hrefParts.length - 1]; // Compare the last segment of the path

  return (
    <li className={`relative overflow-hidden w-full shrink-0 hover:bg-white/10 p-1 rounded-md ${hideText ? 'flex justify-center' : ''} ${isActive ? 'bg-white/20 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-white' : ''}`}>
      <Link href={href} className={`flex items-center w-full ${hideText ? 'justify-center gap-0' : 'gap-4'}`} onClick={onClose}>
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
