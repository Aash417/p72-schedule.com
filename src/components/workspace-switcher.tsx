'use client';

import { useGetWorkspaces } from '@/features/workspaces/api/use-getWorkspaces';
import WorkspaceAvatar from '@/features/workspaces/components/workspace-avatar';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { RiAddCircleFill } from 'react-icons/ri';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from './ui/select';

export default function WorkspaceSwitcher() {
   const { data: workspaces } = useGetWorkspaces();
   const router = useRouter();
   const workspaceId = useWorkspaceId();
   const { open } = useCreateWorkspaceModal();

   function onSelect(id: string) {
      router.push(`/workspaces/${id}`);
   }

   return (
      <div className="flex flex-col gap-y-2">
         <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500">Workspaces</p>

            <RiAddCircleFill
               onClick={open}
               className="size-5 cursor-pointer text-neutral-500 transition hover:opacity-75"
            />
         </div>

         <Select onValueChange={onSelect} value={workspaceId}>
            <SelectTrigger className="w-full bg-neutral-200 p-1 font-medium">
               <SelectValue placeholder="No workspaces selected" />
            </SelectTrigger>

            <SelectContent>
               {workspaces?.documents.map((workspace) => (
                  <SelectItem key={workspace.$id} value={workspace.$id}>
                     <div className="flex items-center justify-center gap-3 font-medium">
                        <WorkspaceAvatar
                           name={workspace.name}
                           image={workspace.imageUrl}
                        />
                        <span>{workspace.name}</span>
                     </div>
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>
      </div>
   );
}
