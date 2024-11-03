'use client';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteTask } from '@/features/tasks/api/use-deleteTask';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import useConfirm from '@/hooks/use-confirm';
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Props = {
   id: string;
   projectId: string;
   children: React.ReactNode;
};

export default function TaskAction({ id, projectId, children }: Props) {
   const router = useRouter();
   const workspaceId = useWorkspaceId();

   const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
   const { open } = useEditTaskModal();
   const [DeleteDialog, confirmDelete] = useConfirm(
      'Delete Task',
      'This action cannot be undone',
      'destructive',
   );

   async function handleDelete() {
      const ok = await confirmDelete();
      if (!ok) return;

      deleteTask({ param: { taskId: id } });
   }

   const onOpenTask = () =>
      router.push(`/workspaces/${workspaceId}/tasks/${id}`);
   const onOpenProject = () =>
      router.push(`/workspaces/${workspaceId}/projects/${projectId}`);

   return (
      <div className="flex justify-end">
         <DeleteDialog />
         <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
               <DropdownMenuItem
                  onClick={onOpenTask}
                  className="p-[10px] font-medium"
               >
                  <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
                  Task details
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={onOpenProject}
                  className="p-[10px] font-medium"
               >
                  <ExternalLinkIcon className="mr-2 size-4 stroke-2" />
                  Open project
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={() => open(id)}
                  className="p-[10px] font-medium"
               >
                  <PencilIcon className="mr-2 size-4 stroke-2" />
                  Edit task
               </DropdownMenuItem>

               <DropdownMenuItem
                  onClick={handleDelete}
                  disabled={isDeletingTask}
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
