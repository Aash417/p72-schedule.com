import { DottedSeparator } from '@/components/dotted-separator';
import Navigation from '@/components/navigation';
import Projects from '@/components/projects';
import WorkspaceSwitcher from '@/components/workspace-switcher';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
   return (
      <aside className="h-full w-full bg-neutral-100 p-4">
         <Link href="/">
            <div className="relative flex flex-row items-center gap-1 text-lg font-semibold">
               <Image
                  src="/logo.svg"
                  alt="logo"
                  width={90}
                  height={48}
                  className="m-0 p-0"
               />
               <span className="absolute left-14 flex">Schedule.com</span>
            </div>
         </Link>
         <DottedSeparator className="my-4" />

         <WorkspaceSwitcher />
         <DottedSeparator className="my-4" />

         <Navigation />
         <DottedSeparator className="my-4" />

         <Projects />
      </aside>
   );
}
