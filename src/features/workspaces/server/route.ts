import {
   DATABASE_ID,
   IMAGES_BUCKET_ID,
   MEMBERS_ID,
   WORKSPACES_ID,
} from '@/config';
import { getMember } from '@/features/members/utils';
import { sessionMiddleware } from '@/lib/session-middleware';
import { generateInviteCode } from '@/lib/utils';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { ID, Query } from 'node-appwrite';
import { createWorkspacesSchema, updateWorkspacesSchema } from '../schemas';
import { MemberRole } from '../types';

const app = new Hono()
   .get('/', sessionMiddleware, async (c) => {
      const user = c.get('user');
      const databases = c.get('databases');
      const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
         Query.equal('userId', user.$id),
      ]);

      if (members.total === 0) {
         return c.json({
            data: { documents: [], total: 0 },
         });
      }

      const workspaceIds = members.documents.map(
         (member) => member.workspaceId,
      );
      const workspaces = await databases.listDocuments(
         DATABASE_ID,
         WORKSPACES_ID,
         [Query.contains('$id', workspaceIds), Query.orderDesc('$createdAt')],
      );

      return c.json({ data: workspaces });
   })
   .post(
      '/',
      zValidator('form', createWorkspacesSchema),
      sessionMiddleware,
      async (c) => {
         const databases = c.get('databases');
         const storage = c.get('storage');
         const user = c.get('user');
         const { name, image } = c.req.valid('form');

         let uploadedImageUrl: string | undefined;
         if (image instanceof File) {
            const file = await storage.createFile(
               IMAGES_BUCKET_ID,
               ID.unique(),
               image,
            );
            const arrayBuffer = await storage.getFilePreview(
               IMAGES_BUCKET_ID,
               file.$id,
            );
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
         }

         const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
               name,
               userId: user.$id,
               imageUrl: uploadedImageUrl,
            },
         );

         await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN,
            inviteCode: generateInviteCode(5),
         });

         return c.json({ data: workspace });
      },
   )
   .patch(
      '/:workspaceId',
      sessionMiddleware,
      zValidator('form', updateWorkspacesSchema),
      async (c) => {
         const databases = c.get('databases');
         const storage = c.get('storage');
         const user = c.get('user');
         const { workspaceId } = c.req.param();
         const { name, image } = c.req.valid('form');

         const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
         });

         if (!member || member.role !== MemberRole.ADMIN)
            return c.json({ error: 'unauthorized' }, 401);

         let uploadedImageUrl: string | undefined;
         if (image instanceof File) {
            const file = await storage.createFile(
               IMAGES_BUCKET_ID,
               ID.unique(),
               image,
            );
            const arrayBuffer = await storage.getFilePreview(
               IMAGES_BUCKET_ID,
               file.$id,
            );
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`;
         } else {
            uploadedImageUrl = image;
         }

         const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
               name,
               imageUrl: uploadedImageUrl,
            },
         );

         return c.json({ data: workspace });
      },
   );

export default app;
