import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export function useLogout() {
   const queryClient = useQueryClient();
   const router = useRouter();

   const mutation = useMutation<ResponseType, Error>({
      mutationFn: async () => {
         const response = await client.api.auth.logout['$post']();
         if (!response.ok) throw new Error('failed to logout');

         return await response.json();
      },
      onSuccess: () => {
         toast.success('Logged out');
         queryClient.invalidateQueries();
         router.refresh();
      },
      onError: () => {
         toast.error('Failed to logout');
      },
   });

   return mutation;
}
