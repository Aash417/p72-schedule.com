import { z } from 'zod';

export const createProjectsSchema = z.object({
   name: z.string().trim().min(1, 'Required'),
   image: z
      .union([
         z.instanceof(File),
         z.string().transform((value) => (value === '' ? undefined : value)),
      ])
      .optional(),
   workspaceId: z.string(),
});

export const updateProjectsSchema = z.object({
   name: z.string().trim().min(1, 'Minimum 1 character required'),
   image: z
      .union([
         z.instanceof(File),
         z.string().transform((value) => (value === '' ? undefined : value)),
      ])
      .optional(),
});
