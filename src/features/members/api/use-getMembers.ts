import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';

type Prop = {
   workspaceId: string;
};
export function useGetMembers({ workspaceId }: Prop) {
   const query = useQuery({
      queryKey: ['members'],
      queryFn: async () => {
         const response = await client.api.members.$get({
            query: { workspaceId },
         });

         if (!response.ok) throw new Error('Failed to fetch Members');

         const { data } = await response.json();
         return data;
      },
   });
   return query;
}
