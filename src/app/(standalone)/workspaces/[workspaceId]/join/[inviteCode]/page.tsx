import { getCurrent } from '@/features/auth/queries';
import JoinWorkspaceForm from '@/features/workspaces/components/join-workspace-form';
import { getWorkspaceInfo } from '@/features/workspaces/queries';
import { redirect } from 'next/navigation';

type Props = {
   params: {
      workspaceId: string;
   };
};

export default async function WorkspaceIdJoinPage({ params }: Props) {
   const user = await getCurrent();
   if (!user) redirect('/sign-in');

   const initialValues = await getWorkspaceInfo({
      workspaceId: params.workspaceId,
   });
   if (!initialValues) redirect('/');

   return (
      <div className="w-full lg:max-w-xl">
         <JoinWorkspaceForm initialValues={initialValues} />
      </div>
   );
}
