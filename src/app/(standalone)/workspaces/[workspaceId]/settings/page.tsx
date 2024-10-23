import { getCurrent } from '@/features/auth/action';
import { getWorkspace } from '@/features/workspaces/action';
import EditWorkspaceForm from '@/features/workspaces/components/edit-workspace-form';
import { redirect } from 'next/navigation';

type Props = {
   params: {
      workspaceId: string;
   };
};

export default async function Page({ params }: Readonly<Props>) {
   const user = await getCurrent();
   if (!user) redirect('/sign-in');

   const initialValues = await getWorkspace({
      workspaceId: params.workspaceId,
   });
   if (!initialValues) redirect(`/workspaces/${params.workspaceId}`);

   return (
      <div className="w-full lg:max-w-xl">
         <EditWorkspaceForm initialValues={initialValues} />
      </div>
   );
}
