import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<
   (typeof client.api.projects)[':projectId']['$patch'],
   200
>;
type RequestType = InferRequestType<
   (typeof client.api.projects)[':projectId']['$patch']
>;

export function useUpdateProject() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ form, param }) => {
         const response = await client.api.projects[':projectId']['$patch']({
            form,
            param,
         });
         if (!response.ok) throw new Error('Failed to update project');

         return await response.json();
      },
      onSuccess: ({ data }) => {
         toast.success('Project updated');
         queryClient.invalidateQueries({
            queryKey: ['projects', 'project', data.$id],
         });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to update project');
      },
   });

   return mutation;
}
