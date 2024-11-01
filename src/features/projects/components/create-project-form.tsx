'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateProject } from '@/features/projects/api/use-createProject';
import { createProjectsSchema } from '@/features/projects/schemas';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function CreateProjectForm({
   onCancel,
}: Readonly<{ onCancel?: () => void }>) {
   const router = useRouter();
   const workspaceId = useWorkspaceId();
   const { mutate, isPending } = useCreateProject();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const form = useForm<z.infer<typeof createProjectsSchema>>({
      resolver: zodResolver(createProjectsSchema.omit({ workspaceId: true })),
      defaultValues: {
         name: '',
      },
   });

   function onSubmit(values: z.infer<typeof createProjectsSchema>) {
      const finalValues = {
         ...values,
         image: values.image instanceof File ? values.image : '',
         workspaceId,
      };

      mutate(
         { form: finalValues },
         {
            onSuccess: ({ data }) => {
               form.reset();
               router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
            },
         },
      );
   }

   function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
      const file = e.target.files?.[0];
      if (file) {
         form.setValue('image', file);
      }
   }

   return (
      <Card className="h-full w-full border-none shadow-none">
         <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
               Create a new project
            </CardTitle>
         </CardHeader>

         <div className="px-7">
            <DottedSeparator />
         </div>

         <CardContent className="p-7">
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col gap-y-4">
                     <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Project Name</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="Enter project name"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                           <div className="flex flex-col gap-y-2">
                              <div className="flex items-center gap-x-5">
                                 {field.value ? (
                                    <div className="relative size-[72px] overflow-hidden rounded-md">
                                       <Image
                                          src={
                                             field.value instanceof File
                                                ? URL.createObjectURL(
                                                     field.value,
                                                  )
                                                : field.value
                                          }
                                          alt="logo"
                                          fill
                                          className="object-cover"
                                       />
                                    </div>
                                 ) : (
                                    <Avatar className="size-[72px]">
                                       <AvatarFallback>
                                          <ImageIcon className="size-[36px] text-neutral-400" />
                                       </AvatarFallback>
                                    </Avatar>
                                 )}
                                 <div className="flex flex-col">
                                    <p className="text-sm">Project Icon</p>
                                    <p className="text-sm text-muted-foreground">
                                       JPG, PNG, SVG or JPEG, max 1mb
                                    </p>
                                    <input
                                       type="file"
                                       accept=".jpg, .png, .jpeg, .svg"
                                       className="hidden"
                                       ref={fileInputRef}
                                       disabled={isPending}
                                       onChange={handleImageChange}
                                    />
                                    {field.value ? (
                                       <Button
                                          type="button"
                                          disabled={isPending}
                                          variant="destructive"
                                          size="xs"
                                          onClick={() => {
                                             field.onChange(null);
                                             if (fileInputRef.current)
                                                fileInputRef.current.value = '';
                                          }}
                                          className="mt-2 w-fit"
                                       >
                                          Remove Image
                                       </Button>
                                    ) : (
                                       <Button
                                          type="button"
                                          disabled={isPending}
                                          variant="teritrary"
                                          size="xs"
                                          onClick={() =>
                                             fileInputRef.current?.click()
                                          }
                                          className="mt-2 w-fit"
                                       >
                                          Upload Image
                                       </Button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        )}
                     />
                  </div>
                  <DottedSeparator className="py-7" />

                  <div className="flex items-center justify-between">
                     <Button
                        type="button"
                        size="lg"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isPending}
                        className={cn(!onCancel && 'invisible')}
                     >
                        Cancel
                     </Button>

                     <Button size="lg" disabled={isPending}>
                        Create Project
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}