import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.login)['$post']>;
type RequestType = InferRequestType<(typeof client.api.auth.login)['$post']>;

export function useLogin() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error, RequestType>({
      mutationFn: async ({ json }) => {
         const response = await client.api.auth.login['$post']({ json });
         if (!response) throw new Error('failed to login');
         return await response.json();
      },
      onSuccess: () => {
         toast.success('Logged in');

         queryClient.invalidateQueries({ queryKey: ['current'] });
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to login');
      },
   });

   return mutation;
}
