import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { TaskStatus } from '@/features/tasks/types';

type Props = {
   workspaceId: string;
   projectId?: string | null;
   status?: TaskStatus | null;
   assigneeId?: string | null;
   dueDate?: string | null;
   search?: string | null;
};

export function useGetTasks({
   workspaceId,
   projectId,
   assigneeId,
   status,
   search,
   dueDate,
}: Props) {
   const query = useQuery({
      queryKey: [
         'tasks',
         workspaceId,
         projectId,
         assigneeId,
         status,
         search,
         dueDate,
      ],
      queryFn: async () => {
         const response = await client.api.tasks.$get({
            query: {
               workspaceId,
               projectId: projectId ?? undefined,
               assigneeId: assigneeId ?? undefined,
               status: status ?? undefined,
               search: search ?? undefined,
               dueDate: dueDate ?? undefined,
            },
         });

         if (!response.ok) throw new Error('Failed to fetch tasks');

         const { data } = await response.json();
         return data;
      },
   });
   return query;
}
