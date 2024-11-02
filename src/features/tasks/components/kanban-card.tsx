import { DottedSeparator } from '@/components/dotted-separator';
import MemberAvatar from '@/features/members/components/member-avatar';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import TaskAction from '@/features/tasks/components/task-actions';
import TaskDate from '@/features/tasks/components/task-date';
import { Task } from '@/features/tasks/types';
import { MoreHorizontal } from 'lucide-react';

type Props = { task: Task };

export default function KanbanCard({ task }: Props) {
   return (
      <div className="mb-1.5 space-y-3 rounded bg-white p-2.5 shadow-sm">
         <div className="flex items-start justify-between gap-x-2">
            <p className="line-clamp-2 text-sm">{task.name}</p>
            <TaskAction id={task.$id} projectId={task.projectId}>
               <MoreHorizontal className="size-[18px] shrink-0 stroke-1 text-neutral-700 transition hover:opacity-75" />
            </TaskAction>
         </div>
         <DottedSeparator />
         <div className="flex items-center gap-x-1.5">
            <MemberAvatar
               name={task.assignee.name}
               fallbackClassName="text-[10px]"
            />
            <div className="size-1 rounded-full bg-neutral-300" />
            <TaskDate value={task.dueDate} className="text-xs" />
         </div>
         <div className="flex items-center gap-x-1.5">
            <ProjectAvatar
               name={task.project.name}
               image={task.project.imageUrl}
               fallbackCalssName="text-[10px]"
            />
            <span className="text-xs font-medium">{task.project.name}</span>
         </div>
      </div>
   );
}
