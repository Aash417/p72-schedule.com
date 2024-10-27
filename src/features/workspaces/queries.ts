import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { createSessionClient } from '@/lib/appwrite';
import { Query } from 'node-appwrite';
import { Workspace } from './types';

export async function getWorkspaces() {
   const { account, databases } = await createSessionClient();
   const user = await account.get();
   const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal('userId', user.$id),
   ]);
   if (members.total === 0) return { documents: [], total: 0 };

   const workspaceIds = members.documents.map((member) => member.workspaceId);
   const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
   );

   return workspaces;
}

type Props = {
   workspaceId: string;
};

export async function getWorkspace({ workspaceId }: Props) {
   const { account, databases } = await createSessionClient();
   const user = await account.get();
   const member = await getMember({
      userId: user.$id,
      workspaceId,
      databases,
   });
   if (!member) throw new Error('unauthorized');

   const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
   );

   return workspace;
}

type WorkspaceInfoProps = {
   workspaceId: string;
};

export async function getWorkspaceInfo({ workspaceId }: WorkspaceInfoProps) {
   const { databases } = await createSessionClient();

   const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId,
   );

   return { name: workspace.name };
}
