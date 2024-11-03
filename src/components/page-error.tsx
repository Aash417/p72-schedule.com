import { AlertTriangle } from 'lucide-react';

type Props = {
   message?: string;
};

export default function PageError({ message = 'Something went wrong' }: Props) {
   return (
      <div className="flex h-full flex-col items-center justify-center">
         <AlertTriangle className="mb-2 size-6 text-muted-foreground" />
         <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
   );
}
