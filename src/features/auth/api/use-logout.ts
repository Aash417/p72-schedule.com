import { client } from '@/lib/rpc';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferResponseType } from 'hono';

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>;

export function useLogout() {
   const queryClient = useQueryClient();

   const mutation = useMutation<ResponseType, Error>({
      mutationFn: async () => {
         const response = await client.api.auth.logout['$post']();
         return await response.json();
      },
      onSuccess: () => {
         console.log('logged out');
         queryClient.invalidateQueries({ queryKey: ['current'] });
      },
   });

   return mutation;
}
