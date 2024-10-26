'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { useJoinWorkspace } from '@/features/workspaces/api/use-joinWorkspace';
import { useInviteCode } from '@/features/workspaces/hooks/use-inviteCode';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Props = {
   initialValues: {
      name: string;
   };
};

export default function JoinWorkspaceForm({ initialValues }: Readonly<Props>) {
   const inviteCode = useInviteCode();
   const workspaceId = useWorkspaceId();
   const { mutate: joinWorkspace, isPending: isJoining } = useJoinWorkspace();
   const router = useRouter();

   function onSubmit() {
      joinWorkspace(
         {
            param: { workspaceId },
            json: { code: inviteCode },
         },
         {
            onSuccess: ({ data }) => {
               router.push(`/workspaces/${data.$id}`);
            },
         },
      );
   }

   return (
      <Card className="h-full w-full border-none shadow-none">
         <CardHeader className="p-7">
            <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
            <CardDescription>
               You&apos;ve been invited to join{' '}
               <strong>{initialValues.name}</strong> workspace
            </CardDescription>
         </CardHeader>

         <div>
            <DottedSeparator />
         </div>

         <CardContent className="p-7">
            <div className="flex flex-col items-center justify-between gap-2 lg:flex-row">
               <Button
                  variant="secondary"
                  size="lg"
                  type="button"
                  asChild
                  className="w-full lg:w-fit"
                  disabled={isJoining}
               >
                  <Link href="/">Cancel</Link>
               </Button>
               <Button
                  size="lg"
                  type="button"
                  className="w-full lg:w-fit"
                  onClick={onSubmit}
                  disabled={isJoining}
               >
                  Join workspace
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
