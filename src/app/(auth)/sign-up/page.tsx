import { SignUpCard } from '@/features/auth/components/sign-up-card';

export default async function page() {
   // const user = await getCurrent();
   // if (user) redirect('/');

   return (
      <div>
         <SignUpCard />
      </div>
   );
}
