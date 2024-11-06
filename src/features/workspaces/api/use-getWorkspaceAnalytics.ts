import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type Props = {
   workspaceId: string;
};

export type WorkspaceAnalyticsResponseType = InferResponseType<
   (typeof client.api.workspaces)[':workspaceId']['analytics']['$get'],
   200
>;

export function useGetWorkspaceAnalytics({ workspaceId }: Props) {
   const query = useQuery({
      queryKey: ['project-analytics', workspaceId],
      queryFn: async () => {
         const response = await client.api.workspaces[':workspaceId'][
            'analytics'
         ].$get({
            param: { workspaceId },
         });

         if (!response.ok)
            throw new Error('Failed to fetch workspaces analytics');

         const { data } = await response.json();
         return data;
      },
   });
   return query;
}
