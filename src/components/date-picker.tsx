'use client';

import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalenderIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';

interface Props {
   value: Date | undefined;
   onChange: (date: Date) => void;
   className?: string;
   placeholder?: string;
   onDueDateChange?: (value: string) => void;
}

export default function DatePicker({
   value,
   onChange,
   className,
   placeholder = 'Select date',
   onDueDateChange,
}: Readonly<Props>) {
   const [newDate, setNewDate] = useState<Date | undefined>(value);

   function handleSelect(selectedDate: Date | undefined) {
      onChange(selectedDate as Date);
   }
   function handleClear() {
      setNewDate(() => undefined);
      onDueDateChange?.('all');
   }

   useEffect(() => {
      setNewDate(value);
   }, [value]);

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               size="lg"
               className={cn(
                  'w-full justify-start px-3 text-left font-normal',
                  !newDate && 'text-muted-foreground',
                  className,
               )}
            >
               <CalenderIcon className="mr-2 h-4 w-4" />
               {newDate ? format(newDate, 'PPP') : <span>{placeholder}</span>}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0">
            <Calendar
               mode="single"
               selected={newDate}
               onSelect={handleSelect}
               initialFocus
            />
            {newDate && (
               <div className="border-t border-border p-3">
                  <Button
                     variant="ghost"
                     onClick={handleClear}
                     className="w-full"
                  >
                     <Cross2Icon className="mr-2 h-4 w-4" />
                     Clear
                  </Button>
               </div>
            )}
         </PopoverContent>
      </Popover>
   );
}
