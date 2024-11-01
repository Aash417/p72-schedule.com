import { z } from 'zod';
import { TaskStatus } from './types';

export const createTasksSchema = z.object({
   name: z.string().trim().min(1, 'Required'),
   status: z.nativeEnum(TaskStatus, { required_error: 'Required' }),
   workspaceId: z.string().trim().min(1, 'Required'),
   projectId: z.string().trim().min(1, 'Required'),
   assigneeId: z.string().trim().min(1, 'Required'),
   dueDate: z.coerce.date(),
   description: z.string().optional(),
});