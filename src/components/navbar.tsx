'use client';

import MobileSidebar from '@/components/mobile-sidebar';
import UserButton from '@/features/auth/components/user-button';
import { usePathname } from 'next/navigation';

const pathnameMap = {
   projects: {
      title: 'My Projects',
      description: 'View all tasks of your project here',
   },
   tasks: {
      title: 'My Tasks',
      description: 'View all your tasks here',
   },
};

const defaultMap = {
   title: 'Home',
   description: 'Monitor all your projects and tasks here',
};

export default function Navbar() {
   const pathname = usePathname();
   const pathnameParts = pathname.split('/');
   const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

   const { title, description } = pathnameMap[pathnameKey] || defaultMap;

   return (
      <nav className="flex items-center justify-between px-6 pt-4">
         <div className="hidden flex-col lg:flex">
            <h1 className="text-2xl font-semibold">{title}</h1>

            <p className="text-muted-foreground">{description}</p>
         </div>
         <MobileSidebar />
         <UserButton />
      </nav>
   );
}
