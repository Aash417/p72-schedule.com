import MembersList from '@/components/members-list';
import { getCurrent } from '@/features/auth/queries';
import { redirect } from 'next/navigation';

export default async function Page() {
   const user = await getCurrent();
   if (!user) redirect('/sign-in');

   return (
      <div className="w-full lg:max-w-xl">
         <MembersList />
      </div>
   );
}
