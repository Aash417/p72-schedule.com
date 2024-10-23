import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { AUTH_COOKIE } from '@/lib/constants';
import { cookies } from 'next/headers';
import { Account, Client, Databases, Query } from 'node-appwrite';
import { Workspace } from './types';

export async function getWorkspaces() {
   try {
      const client = new Client()
         .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
         .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const session = cookies().get(AUTH_COOKIE);
      if (!session) return { documents: [], total: 0 };

      client.setSession(session.value);

      const databases = new Databases(client);
      const account = new Account(client);
      const user = await account.get();

      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
         Query.equal('userId', user.$id),
      ]);
      if (members.total === 0) return { documents: [], total: 0 };

      const workspaceIds = members.documents.map(
         (member) => member.workspaceId,
      );
      const workspaces = await databases.listDocuments(
         DATABASE_ID,
         WORKSPACES_ID,
         [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
      );

      return workspaces;
   } catch (error) {
      console.log(error);
      return { documents: [], total: 0 };
   }
}

type Props = {
   workspaceId: string;
};
export async function getWorkspace({ workspaceId }: Props) {
   try {
      const client = new Client()
         .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
         .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

      const session = cookies().get(AUTH_COOKIE);
      if (!session) return null;

      client.setSession(session.value);

      const databases = new Databases(client);
      const account = new Account(client);
      const user = await account.get();
      const member = await getMember({
         userId: user.$id,
         workspaceId,
         databases,
      });
      if (!member) return null;

      const workspaces = await databases.getDocument<Workspace>(
         DATABASE_ID,
         WORKSPACES_ID,
         workspaceId,
      );

      return workspaces;
   } catch (error) {
      console.log(error);
      return null;
   }
}
