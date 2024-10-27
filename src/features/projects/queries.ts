import { DATABASE_ID, PROJECTS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Projects } from '@/features/projects/types';
import { createSessionClient } from '@/lib/appwrite';

type Props = {
   projectId: string;
};

export async function getProject({ projectId }: Props) {
   const { account, databases } = await createSessionClient();
   const user = await account.get();

   const project = await databases.getDocument<Projects>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
   );

   const member = await getMember({
      userId: user.$id,
      workspaceId: project.workspaceId,
      databases,
   });
   if (!member) throw new Error('unauthorized');

   return project;
}
