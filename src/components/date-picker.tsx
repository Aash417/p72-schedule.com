'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalenderIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface Props {
   value: Date | undefined;
   onChange: (date: Date) => void;
   className?: string;
   placeholder?: string;
}

export default function DatePicker({
   value,
   onChange,
   className,
   placeholder = 'Select date',
}: Readonly<Props>) {
   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               size="lg"
               className={cn(
                  'w-full justify-start px-3 text-left font-normal',
                  !value && 'text-muted-foreground',
                  className,
               )}
            >
               <CalenderIcon className="mr-2 h-4 w-4" />
               {value ? format(value, 'PPP') : <span>{placeholder}</span>}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0">
            <Calendar
               mode="single"
               selected={value}
               onSelect={(date) => onChange(date as Date)}
               initialFocus
            />
         </PopoverContent>
      </Popover>
   );
}
