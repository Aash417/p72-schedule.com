'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import PageError from '@/components/page-error';
import PageLoader from '@/components/page-loader';
import { useGetTask } from '@/features/tasks/api/use-getTask';
import TaskBreadcrumb from '@/features/tasks/components/task-breadcrumbs';
import TaskDescription from '@/features/tasks/components/task-description';
import TaskOverview from '@/features/tasks/components/task-overview';
import { useTaskId } from '@/features/tasks/hooks/use-taskId';

export default function TaskIdClient() {
   const taskId = useTaskId();
   const { data, isLoading } = useGetTask({ taskId });

   if (isLoading) return <PageLoader />;

   if (!data) return <PageError message="Task not found" />;

   return (
      <div className="flex flex-col">
         <TaskBreadcrumb task={data} />
         <DottedSeparator className="my-6" />

         <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <TaskOverview task={data} />

            <TaskDescription task={data} />
         </div>
      </div>
   );
}
