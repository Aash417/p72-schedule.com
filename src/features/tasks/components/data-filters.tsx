'use client';

import DatePicker from '@/components/date-picker';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectSeparator,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { useGetMembers } from '@/features/members/api/use-getMembers';
import { useGetProjects } from '@/features/projects/api/use-getProjects';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { FolderIcon, ListChecksIcon, UserIcon } from 'lucide-react';

type Props = {
   hideProjectFilter?: boolean;
};

export default function DataFilters({ hideProjectFilter }: Props) {
   const workspaceId = useWorkspaceId();
   const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
      workspaceId,
   });
   const { data: members, isLoading: isLoadingMembers } = useGetMembers({
      workspaceId,
   });
   const isLoading = isLoadingProjects || isLoadingMembers;
   const projectOptions = projects?.documents.map((project) => ({
      value: project.$id,
      label: project.name,
   }));
   const memberOptions = members?.documents.map((member) => ({
      value: member.$id,
      label: member.name,
   }));

   const [{ status, dueDate, projectId, assigneeId }, setFilters] =
      useTaskFilters();

   function onStatusChange(value: string) {
      setFilters({ status: value === 'all' ? null : (value as TaskStatus) });
   }
   function onAssigneeChange(value: string) {
      setFilters({ assigneeId: value === 'all' ? null : (value as string) });
   }
   function onProjectChange(value: string) {
      if (value === 'all') setFilters({ projectId: null });
      else setFilters({ projectId: value as string });
   }
   function onDueDateChange(value: string) {
      setFilters({ dueDate: value === 'all' ? null : (value as string) });
   }

   if (isLoading) return null;

   return (
      <div className="flex flex-col gap-2 lg:flex-row">
         {/* Status filter  */}
         <Select
            defaultValue={status ?? undefined}
            onValueChange={(value) => {
               onStatusChange(value);
            }}
         >
            <SelectTrigger className="h-8 w-full lg:w-auto">
               <div className="flex items-center pr-2">
                  <ListChecksIcon className="mr-2 size-4" />
                  <SelectValue placeholder="All status" />
               </div>
            </SelectTrigger>

            <SelectContent>
               <SelectItem value="all">All status</SelectItem>
               <SelectSeparator />
               <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
               <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
               <SelectItem value={TaskStatus.IN_PROGRESS}>
                  In Progress
               </SelectItem>
               <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
               <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
            </SelectContent>
         </Select>

         {/* Assignee filter  */}
         <Select
            defaultValue={assigneeId ?? undefined}
            onValueChange={(value) => {
               onAssigneeChange(value);
            }}
         >
            <SelectTrigger className="h-8 w-full lg:w-auto">
               <div className="flex items-center pr-2">
                  <UserIcon className="mr-2 size-4" />
                  <SelectValue placeholder="All assignees" />
               </div>
            </SelectTrigger>

            <SelectContent>
               <SelectItem value="all">All assignee</SelectItem>
               <SelectSeparator />
               {memberOptions?.map((member) => (
                  <SelectItem key={member.value} value={member.value}>
                     {' '}
                     {member.label}
                  </SelectItem>
               ))}
            </SelectContent>
         </Select>

         {/* Project filter  */}
         {!hideProjectFilter && (
            <Select
               defaultValue={projectId ?? undefined}
               onValueChange={(value) => {
                  onProjectChange(value);
               }}
            >
               <SelectTrigger className="h-8 w-full lg:w-auto">
                  <div className="flex items-center pr-2">
                     <FolderIcon className="mr-2 size-4" />
                     <SelectValue placeholder="All projects" />
                  </div>
               </SelectTrigger>

               <SelectContent>
                  <SelectItem value="all">All project</SelectItem>
                  <SelectSeparator />
                  {projectOptions?.map((project) => (
                     <SelectItem key={project.value} value={project.value}>
                        {' '}
                        {project.label}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         )}
         {/* Date filter */}
         <DatePicker
            onDueDateChange={onDueDateChange}
            placeholder="Due date"
            className="h-8 w-full lg:w-auto"
            value={dueDate ? new Date(dueDate) : undefined}
            onChange={(date) => {
               setFilters({ dueDate: date ? date.toISOString() : null });
            }}
         />
      </div>
   );
}
