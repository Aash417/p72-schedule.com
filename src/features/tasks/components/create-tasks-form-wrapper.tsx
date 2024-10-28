'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-getMembers';
import { useGetProjects } from '@/features/projects/api/use-getProjects';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Loader } from 'lucide-react';
import CreateTaskForm from './create-task-form';

export default function CreateTaskFormWrapper({
   onCancel,
}: Readonly<{ onCancel?: () => void }>) {
   const workspaceId = useWorkspaceId();

   const { data: projects, isLoading: isLoadingProject } = useGetProjects({
      workspaceId,
   });
   const { data: members, isLoading: isLoadingMembers } = useGetMembers({
      workspaceId,
   });

   const projectsOptions = projects?.documents.map((project) => ({
      id: project.$id,
      name: project.name,
      imageUrl: project.imageUrl,
   }));
   const memberOptions = members?.documents.map((member) => ({
      id: member.$id,
      name: member.name,
   }));

   const isLoading = isLoadingMembers || isLoadingProject;
   if (isLoading) {
      return (
         <Card className="h-[714px] w-full border-none shadow-none">
            <CardContent className="flex h-full items-center justify-center">
               <Loader className="size-5 animate-spin text-muted-foreground" />
            </CardContent>
         </Card>
      );
   }

   return (
      <CreateTaskForm
         onCancel={onCancel}
         projectOptions={projectsOptions ?? []}
         memberOptions={memberOptions ?? []}
      />
   );
}
