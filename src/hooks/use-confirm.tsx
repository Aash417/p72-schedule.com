import ResponsiveModal from '@/components/responsive-modal';
import { Button, ButtonProps } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { useState } from 'react';

export default function UseConfirm(
   title: string,
   message: string,
   variant: ButtonProps['variant'] = 'primary',
): [() => JSX.Element, () => Promise<unknown>] {
   const [promise, setPromise] = useState<{
      resolve: (value: boolean) => void;
   } | null>(null);

   function confirm() {
      return new Promise((resolve) => {
         setPromise({ resolve });
      });
   }
   function handleClose() {
      setPromise(null);
   }
   function handleConfirm() {
      promise?.resolve(true);
      handleClose();
   }
   function handleCancle() {
      promise?.resolve(false);
      handleClose();
   }
   function ConfirmationDialog() {
      return (
         <ResponsiveModal open={promise !== null} onOpenchange={handleClose}>
            <Card className="h-full w-full border-none shadow-none">
               <CardContent>
                  <CardHeader className="pt-8">
                     <CardTitle className="p-0">{title}</CardTitle>
                     <CardDescription>{message}</CardDescription>
                  </CardHeader>

                  <div className="flex w-full flex-col items-center justify-end gap-x-2 gap-y-2 pt-4 lg:flex-row">
                     <Button
                        onClick={handleCancle}
                        variant="outline"
                        className="w-full lg:w-auto"
                     >
                        Cancel
                     </Button>
                     <Button
                        onClick={handleConfirm}
                        variant={variant}
                        className="w-full lg:w-auto"
                     >
                        Confirm
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </ResponsiveModal>
      );
   }

   return [ConfirmationDialog, confirm];
}
