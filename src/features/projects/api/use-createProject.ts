import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.projects)['$post'],
   200
>;
type RequestType = InferRequestType<(typeof client.api.projects)['$post']>;

export function useCreateProject() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ form }) => {
         const response = await client.api.projects['$post']({ form });
         if (!response.ok) throw new Error('Failed to create project');

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Project created');
         queryClient.invalidateQueries({
            queryKey: ['projects'],
         });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to create project');
      },
   });

   return mutation;
}
