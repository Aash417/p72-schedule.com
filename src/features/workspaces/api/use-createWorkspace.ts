import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.workspaces)['$post']>;
type RequestType = InferRequestType<(typeof client.api.workspaces)['$post']>;

export function useCreateWorkspace() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ json }) => {
         const response = await client.api.workspaces['$post']({ json });
         return await response.json();
      },
      onSuccess: () => {
         toast.success('Workspace created');
         queryClient.invalidateQueries({ queryKey: ['workspaces'] });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to create workspace');
      },
   });

   return mutation;
}
