'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBuldUpdateTask } from '@/features/tasks/api/use-bulkUpdateTask';
import { useGetTasks } from '@/features/tasks/api/use-getTasks';
import { columns } from '@/features/tasks/components/columns';
import DataCalendar from '@/features/tasks/components/data-calendar';
import DataFilters from '@/features/tasks/components/data-filters';
import DataKanban from '@/features/tasks/components/data-kanban';
import DataTable from '@/features/tasks/components/data-table';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Loader, PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useCallback } from 'react';

export default function TaskViewSwitcher() {
   const { open } = useCreateTaskModal();
   const [view, setView] = useQueryState('task-view', {
      defaultValue: 'table',
   });

   const { mutate: bulkUpdate } = useBuldUpdateTask();
   const [{ status, dueDate, projectId, assigneeId }] = useTaskFilters();

   const workspaceId = useWorkspaceId();
   const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
      workspaceId,
      projectId,
      assigneeId,
      status,
      dueDate,
   });

   const onkanbanChange = useCallback(
      (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
         bulkUpdate({ json: { tasks } });
      },
      [bulkUpdate],
   );

   return (
      <Tabs
         defaultValue={view}
         onValueChange={setView}
         className="w-full flex-1 rounded-lg border"
      >
         <div className="flex h-full flex-col overflow-auto p-4">
            <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
               <TabsList className="w-full lg:w-auto">
                  <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                     Table
                  </TabsTrigger>
                  <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                     Kanban
                  </TabsTrigger>
                  <TabsTrigger
                     value="calender"
                     className="h-8 w-full lg:w-auto"
                  >
                     Calender
                  </TabsTrigger>
               </TabsList>

               <Button size="sm" className="w-full lg:w-auto" onClick={open}>
                  <PlusIcon className="mr-2 size-4" />
                  New
               </Button>
            </div>
            <DottedSeparator className="my-7" />

            <DataFilters />
            <DottedSeparator className="my-7" />

            {isLoadingTasks ? (
               <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-lg border">
                  <Loader className="size-5 animate-spin text-muted-foreground" />
               </div>
            ) : (
               <>
                  <TabsContent value="table" className="mt-0">
                     <DataTable
                        columns={columns}
                        data={tasks?.documents ?? []}
                     />
                  </TabsContent>
                  <TabsContent value="kanban" className="mt-0">
                     <DataKanban
                        data={tasks?.documents ?? []}
                        onChange={onkanbanChange}
                     />
                  </TabsContent>
                  <TabsContent value="calender" className="mt-0">
                     <DataCalendar data={tasks?.documents ?? []} />
                  </TabsContent>
               </>
            )}
         </div>
      </Tabs>
   );
}
