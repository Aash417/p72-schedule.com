'use client';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { SettingsIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
   GoCheckCircle,
   GoCheckCircleFill,
   GoHome,
   GoHomeFill,
} from 'react-icons/go';

const routes = [
   {
      label: 'Home',
      href: '',
      icon: GoHome,
      activeIcon: GoHomeFill,
   },
   {
      label: 'My Tasks',
      href: '/tasks',
      icon: GoCheckCircle,
      activeIcon: GoCheckCircleFill,
   },
   {
      label: 'Settings',
      href: '/settings',
      icon: SettingsIcon,
      activeIcon: SettingsIcon,
   },
   {
      label: 'Members',
      href: '/members',
      icon: UsersIcon,
      activeIcon: UsersIcon,
   },
];

export default function Navigation() {
   const pathname = usePathname();
   const workspaceId = useWorkspaceId();

   return (
      <ul className="flex flex-col">
         {routes.map((item, index) => {
            const fullHref = `/workspaces/${workspaceId}${item.href}`;
            const isActive = pathname === fullHref;
            const Icon = isActive ? item.activeIcon : item.icon;

            return (
               <li key={index + 1}>
                  <Link href={fullHref}>
                     <div
                        className={cn(
                           'flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:text-primary',
                           isActive &&
                              'bg-white text-primary shadow-sm hover:opacity-100',
                        )}
                     >
                        <Icon className="size-5 text-neutral-500" />
                        {item.label}
                     </div>
                  </Link>
               </li>
            );
         })}
      </ul>
   );
}
