import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.workspaces)[':workspaceId']['join']['$post'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.workspaces)[':workspaceId']['join']['$post']
>;

export function useJoinWorkspace() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param, json }) => {
         const response = await client.api.workspaces[':workspaceId']['join'][
            '$post'
         ]({ param, json });
         if (!response.ok) throw new Error('Failed to join workspace');

         return await response.json();
      },
      onSuccess: ({ data }) => {
         toast.success('Joined workspace');
         queryClient.invalidateQueries({
            queryKey: ['workspaces', 'workspace', data.$id],
         });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to join workspace');
      },
   });

   return mutation;
}
