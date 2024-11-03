import { DATABASE_ID, PROJECTS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Project } from '@/features/projects/types';
import { createSessionClient } from '@/lib/appwrite';

type Props = {
   projectId: string;
};

export async function getProject({ projectId }: Props) {
   const { account, databases } = await createSessionClient();
   const user = await account.get();

   const project = await databases.getDocument<Project>(
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
