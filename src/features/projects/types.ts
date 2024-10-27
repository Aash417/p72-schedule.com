import { Models } from 'node-appwrite';

export type Projects = Models.Document & {
   name: string;
   imageUrl?: string;
   workspaceId: string;
};
