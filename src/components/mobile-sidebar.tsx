'use client';

import { MenuIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function MobileSidebar() {
   const [isOpen, setIsOpen] = useState(false);
   const pathname = usePathname();

   useEffect(() => {
      setIsOpen(false);
   }, [pathname]);

   return (
      <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
         <SheetTrigger asChild>
            <Button variant="secondary" className="lg:hidden">
               <MenuIcon className="size-5 text-neutral-500" />
            </Button>
         </SheetTrigger>

         <SheetContent side="left" className="p-0">
            <Sidebar />
         </SheetContent>
      </Sheet>
   );
}
