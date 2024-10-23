import { Models } from 'node-appwrite';

export enum MemberRole {
   ADMIN = 'Admin',
   MEMBER = 'member',
}

export type Workspace = Models.Document & {
   name: string;
   imageUrl?: string;
   inviteCode: string;
   userId: string;
};
