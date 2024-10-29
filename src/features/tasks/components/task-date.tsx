import { cn } from '@/lib/utils';
import { differenceInDays, format } from 'date-fns';

type Props = {
   value: string;
   className?: string;
};

export default function TaskDate({ value, className }: Props) {
   const today = new Date();
   const endDate = new Date(value);
   const diffInDays = differenceInDays(endDate, today);

   let textColor = 'text-muted-foreground';

   if (diffInDays <= 3) textColor = 'text-red-500';
   else if (diffInDays <= 7) textColor = 'text-orange-500';
   else if (diffInDays <= 14) textColor = 'text-yellow-500';

   return (
      <div className={textColor}>
         <span className={cn('truncate', className)}>
            {format(value, 'PPP')}
         </span>
      </div>
   );
}
