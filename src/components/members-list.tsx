'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useDeleteMember } from '@/features/members/api/use-deleteMember';
import { useGetMembers } from '@/features/members/api/use-getMembers';
import { useUpdateMember } from '@/features/members/api/use-updateMember';
import MemberAvatar from '@/features/members/components/member-avatar';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { MemberRole } from '@/features/workspaces/types';
import UseConfirm from '@/hooks/use-confirm';
import { ArrowLeftIcon, MoreVerticalIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';

export default function MembersList() {
   const router = useRouter();
   const workspaceId = useWorkspaceId();
   const { data } = useGetMembers({ workspaceId });
   const [RemoveDialog, confirmRemove] = UseConfirm(
      'Remove member',
      'This member will be remove from the workspace',
      'destructive',
   );
   const { mutate: deleteMember, isPending: isDeletingMember } =
      useDeleteMember();
   const { mutate: updateMember, isPending: isUpdatingMember } =
      useUpdateMember();

   function handleUpdateMember(memberId: string, role: MemberRole) {
      updateMember({
         json: { role },
         param: { memberId },
      });
   }

   async function handleDeleteMember(memberId: string) {
      const ok = await confirmRemove();
      if (!ok) return;

      deleteMember(
         { param: { memberId } },
         {
            onSuccess: () => {
               window.location.reload();
            },
         },
      );
   }

   return (
      <Card className="h-full w-full border-none shadow-none">
         <RemoveDialog />
         <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
            <Button
               variant="secondary"
               size="sm"
               onClick={() => router.push(`/workspaces/${workspaceId}`)}
            >
               <ArrowLeftIcon className="mr-2 size-4" />
               Back
            </Button>
            <CardTitle className="text-xl font-bold">Members list</CardTitle>
         </CardHeader>
         <div className="px-7">
            <DottedSeparator />
         </div>

         <CardContent className="p-7">
            {data?.documents.map((member, index) => {
               return (
                  <Fragment key={member.$id}>
                     <div className="flex items-center gap-2">
                        <MemberAvatar
                           name={member.name}
                           className="size-10"
                           fallbackClassName="text-lg"
                        />
                        <div className="flex flex-col">
                           <p className="text-sm font-medium">{member.name}</p>
                           <p className="text-xs text-muted-foreground">
                              {member.email}
                           </p>
                        </div>
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button
                                 className="ml-auto"
                                 variant="secondary"
                                 size="icon"
                              >
                                 <MoreVerticalIcon className="size-4 text-muted-foreground" />
                              </Button>
                           </DropdownMenuTrigger>

                           <DropdownMenuContent side="bottom" align="end">
                              <DropdownMenuItem
                                 className="font-medium"
                                 onClick={() =>
                                    handleUpdateMember(
                                       member.$id,
                                       MemberRole.ADMIN,
                                    )
                                 }
                                 disabled={isUpdatingMember}
                              >
                                 Set as Administrator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 className="font-medium"
                                 onClick={() =>
                                    handleUpdateMember(
                                       member.$id,
                                       MemberRole.MEMBER,
                                    )
                                 }
                                 disabled={isUpdatingMember}
                              >
                                 Set as Member
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                 className="font-medium text-amber-700"
                                 onClick={() => handleDeleteMember(member.$id)}
                                 disabled={isDeletingMember}
                              >
                                 Remove {member.name}
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </div>
                     {index < data.documents.length - 1 && (
                        <Separator className="my-2.5" />
                     )}
                  </Fragment>
               );
            })}
         </CardContent>
      </Card>
   );
}
