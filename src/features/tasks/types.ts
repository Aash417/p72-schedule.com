import { Models } from 'node-appwrite';

export enum TaskStatus {
   BACKLOG = 'BACKLOG',
   TODO = 'TODO',
   IN_PROGRESS = 'IN_PROGRESS',
   IN_REVIEW = 'IN_REVIEW',
   DONE = 'DONE',
}

export type Tasks = Models.Document & {
   name: string;
   projectId: string;
   assigneeId: string;
   dueDate: string;
   position: number;
   status: TaskStatus;
};
