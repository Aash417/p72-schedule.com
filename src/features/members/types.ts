import { Models } from 'node-appwrite';

export enum MemberRole {
   ADMIN = 'Admin',
   MEMBER = 'member',
}

export type Member = Models.Document & {
   name: string;
   email: string;
   userId: string;
   workspaceId: string;
   role: MemberRole;
};
