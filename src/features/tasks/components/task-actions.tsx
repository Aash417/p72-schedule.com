import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';

type Props = {
   id: string;
   projectId: string;
   children: React.ReactNode;
};

export default function TaskAction({ id, projectId, children }: Props) {
   return (
      <div className="flex justify-end">
         <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem
                  onClick={() => {}}
                  disabled={false}
                  className="p-[10px] font-medium"
               >
                  <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
                  Task details
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => {}}
                  disabled={false}
                  className="p-[10px] font-medium"
               >
                  <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
                  Open project
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => {}}
                  disabled={false}
                  className="p-[10px] font-medium"
               >
                  <PencilIcon className="mr-2 size-4 stroke-2" />
                  Edit task
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => {}}
                  disabled={false}
                  className="p-[10px] font-medium text-amber-700 focus:text-amber-700"
               >
                  <TrashIcon className="mr-2 size-4 stroke-2" />
                  Delete task
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
}
