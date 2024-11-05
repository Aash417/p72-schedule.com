import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.projects)[':projectId']['$delete'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.projects)[':projectId']['$delete']
>;

export function useDeleteProject() {
   const queryClient = useQueryClient();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ param }) => {
         const response = await client.api.projects[':projectId']['$delete']({
            param,
         });
         if (!response.ok) throw new Error('Failed to delete project');

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Project deleted');
         queryClient.invalidateQueries({ queryKey: ['project'] });
         queryClient.invalidateQueries({ queryKey: ['projects'] });
      },
      onError: () => {
         toast.error('Failed to delete project');
      },
   });

   return mutation;
}
