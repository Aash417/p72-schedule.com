import { getCurrent } from '@/features/auth/action';
import { redirect } from 'next/navigation';

export default async function Page() {
   const user = await getCurrent();
   if (!user) redirect('/sign-in');

   return <div>workspace id page</div>;
}
