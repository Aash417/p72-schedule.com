'use client';

import { Button } from '@/components/ui/button';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { useDeleteTask } from '@/features/tasks/api/use-deleteTask';
import { Task } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import UseConfirm from '@/hooks/use-confirm';
import { ChevronRightIcon, TrashIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
   task: Task;
};

export default function TaskBreadcrumb({ task }: Readonly<Props>) {
   const router = useRouter();
   const workspaceId = useWorkspaceId();
   const { project } = task;

   const { mutate: deleteTask, isPending: isDeletingTask } = useDeleteTask();
   const [ConfirmDeleteTask, confirmDelete] = UseConfirm(
      'Delete Task',
      'This action cannot be undone',
      'destructive',
   );

   async function handleDelete() {
      const ok = await confirmDelete();
      if (!ok) return;

      deleteTask(
         { param: { taskId: task.$id } },
         {
            onSuccess: () => {
               router.push(`/workspaces/${workspaceId}/tasks`);
            },
         },
      );
   }

   return (
      <div className="flex items-center gap-x-2">
         <ConfirmDeleteTask />
         <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-6 lg:size-8"
         />

         <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
            <p className="text-sm font-semibold text-muted-foreground transition hover:opacity-75 lg:text-lg">
               {project.name}
            </p>
         </Link>
         <ChevronRightIcon />
         <p className="text-sm font-semibold lg:text-lg">{task.name}</p>
         <Button
            onClick={handleDelete}
            disabled={isDeletingTask}
            className="ml-auto"
            variant="destructive"
            size="sm"
         >
            <TrashIcon className="size-4 lg:mr-2" />
            <span className="hidden lg:block">Delete task</span>
         </Button>
      </div>
   );
}
