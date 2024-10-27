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
            <Image src="/logo.svg" alt="logo" width={164} height={48} />
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
