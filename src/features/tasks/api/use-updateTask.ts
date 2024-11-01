import { client } from '@/lib/rpc';
import { useMutation } from '@tanstack/react-query';
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
      },
      onError: () => {
         toast.error('Failed to update task');
      },
   });

   return mutation;
}
