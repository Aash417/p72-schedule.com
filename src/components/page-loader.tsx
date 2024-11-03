import { Loader } from 'lucide-react';

export default function PageLoader() {
   return (
      <div className="flex h-screen flex-col items-center justify-center">
         <Loader className="size-8 animate-spin text-muted-foreground" />
      </div>
   );
}
