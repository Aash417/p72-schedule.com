import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.workspaces)[':workspaceId']['$patch'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.workspaces)[':workspaceId']['$patch']
>;

export function useUpdateWorkspace() {
   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ form, param }) => {
         const response = await client.api.workspaces[':workspaceId']['$patch'](
            { form, param },
         );

         if (!response.ok) throw new Error('Failed to update workspaces');

         // Handle the success case
         return await response.json();
      },
      onSuccess: () => {
         toast.success('Workspace updated');
      },
      onError: () => {
         toast.error('Failed to update workspace');
      },
   });

   return mutation;
}
