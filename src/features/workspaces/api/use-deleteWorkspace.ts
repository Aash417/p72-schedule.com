import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.workspaces)[':workspaceId']['$delete'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.workspaces)[':workspaceId']['$delete']
>;

export function useDeleteWorkspace() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param }) => {
         const response = await client.api.workspaces[':workspaceId'][
            '$delete'
         ]({ param });
         if (!response.ok) throw new Error('Falied to delete workspace');

         return await response.json();
      },
      onSuccess: ({ data }) => {
         toast.success('Workspace deleted');
         queryClient.invalidateQueries({
            queryKey: ['workspaces', 'workspace', data.$id],
         });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to delete workspace');
      },
   });

   return mutation;
}