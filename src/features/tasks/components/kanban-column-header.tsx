import { Button } from '@/components/ui/button';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { TaskStatus } from '@/features/tasks/types';
import { snakeCaseToTitleCase } from '@/lib/utils';
import {
   CircleCheckIcon,
   CircleDashedIcon,
   CircleDotDashedIcon,
   CircleDotIcon,
   CircleIcon,
   PlusIcon,
} from 'lucide-react';

type Props = {
   board: TaskStatus;
   taskCount: number;
};

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
   [TaskStatus.BACKLOG]: (
      <CircleDashedIcon className="size-[18px] text-pink-400" />
   ),
   [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
   [TaskStatus.IN_PROGRESS]: (
      <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
   ),
   [TaskStatus.IN_REVIEW]: (
      <CircleDotIcon className="size-[18px] text-blue-400" />
   ),
   [TaskStatus.DONE]: (
      <CircleCheckIcon className="size-[18px] text-green-400" />
   ),
};

export default function KanbanColumnHeader({ board, taskCount }: Props) {
   const icon = statusIconMap[board];
   const { open } = useCreateTaskModal();

   return (
      <div className="flex items-center justify-between px-1 py-1.5">
         <div className="flex items-center gap-x-2">
            {icon}
            <h2>{snakeCaseToTitleCase(board)}</h2>
            <div className="flex size-5 items-center justify-center rounded-md bg-neutral-200 text-xs font-medium text-neutral-700">
               {taskCount}
            </div>
         </div>

         <Button onClick={open} variant="ghost" size="icon" className="size-5">
            <PlusIcon className="size-4 text-neutral-500" />
         </Button>
      </div>
   );
}
