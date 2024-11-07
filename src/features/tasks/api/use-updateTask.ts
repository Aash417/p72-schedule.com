import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.tasks)[':taskId']['$patch'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.tasks)[':taskId']['$patch']
>;

export function useUpdateTask() {
   const queryClient = useQueryClient();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ json, param }) => {
         const response = await client.api.tasks[':taskId']['$patch']({
            json,
            param,
         });
         if (!response.ok) throw new Error('Failed to update task');

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Task updated');
         queryClient.invalidateQueries({ queryKey: ['task'] });
         queryClient.invalidateQueries({ queryKey: ['tasks'] });
         queryClient.invalidateQueries({ queryKey: ['project-analytics'] });
         queryClient.invalidateQueries({ queryKey: ['workspace-analytics'] });
      },
      onError: () => {
         toast.error('Failed to update task');
      },
   });

   return mutation;
}
