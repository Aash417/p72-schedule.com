'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Props = { children: React.ReactNode };

export default function Layout({ children }: Props) {
   const pathname = usePathname();
   const isSignIn = pathname === '/sign-in';
   return (
      <main className="min-h-screen bg-neutral-100">
         <div className="mx-auto max-w-screen-2xl p-4">
            <nav className="flex items-center justify-between">
               <Image src="/logo.svg" alt="logo" height={50} width={152} />
               <Button asChild variant="secondary">
                  <Link href={isSignIn ? '/sign-up' : '/sign-in'}>
                     {isSignIn ? 'Sign Up' : 'Login'}
                  </Link>
               </Button>
            </nav>

            <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
               {children}
            </div>
         </div>
      </main>
   );
}
