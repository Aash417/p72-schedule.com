import { Models } from 'node-appwrite';

export enum TaskStatus {
   BACKLOG = 'BACKLOG',
   TODO = 'TODO',
   IN_PROGRESS = 'IN_PROGRESS',
   IN_REVIEW = 'IN_REVIEW',
   DONE = 'DONE',
}

export type Task = Models.Document & {
   name: string;
   workspaceId: string;
   projectId: string;
   assigneeId: string;
   dueDate: string;
   position: number;
   status: TaskStatus;
   description?: string;
};

export type Assignee = Models.Document & {
   name: string;
   email: string;
};
