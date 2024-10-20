import { useMedia } from 'react-use';
import { Dialog, DialogContent } from './ui/dialog';
import { Drawer, DrawerContent } from './ui/drawer';

type Props = {
   children: React.ReactNode;
   open: boolean;
   onOpenchange: (open: boolean) => void;
};

export default function ResponsiveModal({
   children,
   open,
   onOpenchange,
}: Readonly<Props>) {
   const isDesktop = useMedia('(min-width: 1024px)', true);

   if (isDesktop) {
      return (
         <Dialog open={open} onOpenChange={onOpenchange}>
            <DialogContent>
               <div className="hide-scrollbar max-h-[85vh] w-full overflow-y-auto border-none p-0 sm:max-w-lg">
                  {children}
               </div>
            </DialogContent>
         </Dialog>
      );
   }

   return (
      <Drawer open={open} onOpenChange={onOpenchange}>
         <DrawerContent>
            <div className="hide-scrollbar max-h-[85vh] overflow-y-auto">
               {children}
            </div>
         </DrawerContent>
      </Drawer>
   );
}
