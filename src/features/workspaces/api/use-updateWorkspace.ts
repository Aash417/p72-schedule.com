import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.workspaces)[':workspaceId']['$patch'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.workspaces)[':workspaceId']['$patch']
>;

export function useUpdateWorkspace() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ form, param }) => {
         const response = await client.api.workspaces[':workspaceId']['$patch'](
            { form, param },
         );

         if (!response.ok) throw new Error('Failed to update workspaces');

         // Handle the success case
         return await response.json();
      },
      onSuccess: ({ data }) => {
         toast.success('Workspace updated');
         queryClient.invalidateQueries({
            queryKey: ['workspaces', 'workspace', data.$id],
         });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to update workspace');
      },
   });

   return mutation;
}
