import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from '@/config';
import { getMember } from '@/features/members/utils';
import { Projects } from '@/features/projects/types';
import { createTasksSchema } from '@/features/tasks/schemas';
import { Tasks, TaskStatus } from '@/features/tasks/types';
import { createAdminClient } from '@/lib/appwrite';
import { sessionMiddleware } from '@/lib/session-middleware';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { z } from 'zod';

const app = new Hono()
   .get(
      '/',
      sessionMiddleware,
      zValidator(
         'query',
         z.object({
            workspaceId: z.string(),
            projectId: z.string().nullish(),
            assigneeId: z.string().nullish(),
            search: z.string().nullish(),
            dueDate: z.string().nullish(),
            status: z.nativeEnum(TaskStatus).nullish(),
         }),
      ),
      async (c) => {
         const { users } = await createAdminClient();
         const user = c.get('user');
         const databases = c.get('databases');
         const { status, search, dueDate, assigneeId, projectId, workspaceId } =
            c.req.valid('query');

         const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
         });
         if (!member) return c.json({ error: 'unauthorized' }, 401);

         const query = [
            Query.equal('workspaceId', workspaceId),
            Query.orderDesc('$createdAt'),
         ];

         if (projectId) query.push(Query.equal('projectId', projectId));
         if (status) query.push(Query.equal('status', status));
         if (assigneeId) query.push(Query.equal('assigneeId', assigneeId));
         if (dueDate) query.push(Query.equal('dueDate', dueDate));
         if (search) query.push(Query.equal('name', search));

         const tasks = await databases.listDocuments<Tasks>(
            DATABASE_ID,
            TASKS_ID,
            query,
         );
         const projectIds = tasks.documents.map((task) => task.projectId);
         const assigneeIds = tasks.documents.map((task) => task.assigneeId);

         const projects = await databases.listDocuments<Projects>(
            DATABASE_ID,
            PROJECTS_ID,
            projectIds.length > 0 ? [Query.contains('$id', projectIds)] : [],
         );
         const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : [],
         );
         const assignees = await Promise.all(
            members.documents.map(async (member) => {
               const user = await users.get(member.userId);
               return { ...member, name: user.name, email: user.email };
            }),
         );

         const populatedTasks = tasks.documents.map((task) => {
            const project = projects.documents.find(
               (project) => project.$id === task.projectId,
            );
            const assignee = assignees.find(
               (assignee) => assignee.$id === task.assigneeId,
            );
            return { ...task, project, assignee };
         });

         return c.json({ data: { ...tasks, documents: populatedTasks } });
      },
   )
   .post(
      '/',
      sessionMiddleware,
      zValidator('json', createTasksSchema),
      async (c) => {
         const user = c.get('user');
         const databases = c.get('databases');
         const { name, status, dueDate, assigneeId, projectId, workspaceId } =
            c.req.valid('json');

         const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
         });
         if (!member) return c.json({ error: 'unauthorized' }, 401);

         const highestPositionTask = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
               Query.equal('status', status),
               Query.equal('workspaceId', workspaceId),
               Query.orderAsc('position'),
               Query.limit(1),
            ],
         );
         const newPosition =
            highestPositionTask.documents.length > 0
               ? highestPositionTask.documents[0].position + 1000
               : 1000;

         const task = await databases.createDocument(
            DATABASE_ID,
            TASKS_ID,
            ID.unique(),
            {
               name,
               status,
               dueDate,
               assigneeId,
               projectId,
               workspaceId,
               position: newPosition,
            },
         );

         return c.json({ data: task });
      },
   )
   .delete('/:taskId', sessionMiddleware, async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');
      const { taskId } = c.req.param();

      const task = await databases.getDocument<Tasks>(
         DATABASE_ID,
         TASKS_ID,
         taskId,
      );
      if (!task)
         return c.json({ error: 'Task with id could not be found' }, 401);

      const member = await getMember({
         databases,
         workspaceId: task.workspaceId,
         userId: user.$id,
      });
      if (!member) return c.json({ error: 'unauthorized' }, 401);

      await databases.deleteDocument(DATABASE_ID, TASKS_ID, taskId);

      return c.json({ data: { $id: task.$id } });
   })
   .patch(
      '/:taskId',
      sessionMiddleware,
      zValidator('json', createTasksSchema.partial()),
      async (c) => {
         const user = c.get('user');
         const databases = c.get('databases');
         const { taskId } = c.req.param();
         const { name, status, dueDate, assigneeId, projectId, description } =
            c.req.valid('json');

         const exitstingTask = await databases.getDocument<Tasks>(
            DATABASE_ID,
            TASKS_ID,
            taskId,
         );

         const member = await getMember({
            databases,
            workspaceId: exitstingTask.workspaceId,
            userId: user.$id,
         });
         if (!member) return c.json({ error: 'unauthorized' }, 401);

         const task = await databases.updateDocument(
            DATABASE_ID,
            TASKS_ID,
            taskId,
            {
               name,
               status,
               dueDate,
               assigneeId,
               projectId,
               description,
            },
         );

         return c.json({ data: task });
      },
   )
   .get('/:taskId', sessionMiddleware, async (c) => {
      const currentUser = c.get('user');
      const databases = c.get('databases');
      const { users } = await createAdminClient();
      const { taskId } = c.req.param();

      const task = await databases.getDocument<Tasks>(
         DATABASE_ID,
         TASKS_ID,
         taskId,
      );

      const currentMember = await getMember({
         databases,
         workspaceId: task.workspaceId,
         userId: currentUser.$id,
      });
      if (!currentMember) return c.json({ error: 'unauthorized' }, 401);

      const project = await databases.getDocument(
         DATABASE_ID,
         PROJECTS_ID,
         task.projectId,
      );
      const member = await databases.getDocument(
         DATABASE_ID,
         MEMBERS_ID,
         task.assigneeId,
      );

      const user = await users.get(member.userId);
      const assignee = {
         ...member,
         name: user.name,
         email: user.email,
      };

      return c.json({
         data: {
            ...task,
            project,
            assignee,
         },
      });
   });

export default app;