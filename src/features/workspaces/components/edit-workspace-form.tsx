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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import { ArrowLeftIcon, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useUpdateWorkspace } from '../api/use-updateWorkspace';
import { updateWorkspacesSchema } from '../schemas';
import { Workspace } from '../types';

type WorkspaceSchema = typeof updateWorkspacesSchema;
type EditWorkspaceFormProps = {
   onCancel?: () => void;
   initialValues: Workspace;
};

export default function EditWorkspaceForm({
   onCancel,
   initialValues,
}: Readonly<EditWorkspaceFormProps>) {
   const router = useRouter();
   const { mutate, isPending } = useUpdateWorkspace();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const form = useForm<z.infer<WorkspaceSchema>>({
      resolver: zodResolver(updateWorkspacesSchema),
      defaultValues: {
         ...initialValues,
         image: initialValues.imageUrl ?? '',
      },
   });

   function onSubmit(values: z.infer<typeof updateWorkspacesSchema>) {
      const finalValues = {
         ...values,
         image: values.image instanceof File ? values.image : '',
      };

      mutate(
         { form: finalValues, param: { workspaceId: initialValues.$id } },
         {
            onSuccess: ({ data }) => {
               form.reset();
               router.push(`/workspaces/${data.$id}`);
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
         <CardHeader className="flex flex-row items-center gap-x-4 space-y-0 p-7">
            <Button
               size="sm"
               variant="secondary"
               onClick={
                  onCancel ||
                  (() => router.push(`/workspaces/${initialValues.$id}`))
               }
            >
               <ArrowLeftIcon className="mr-2 size-4" />
               Back
            </Button>

            <CardTitle className="text-xl font-bold">
               {initialValues.name}
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
                              <FormLabel>Workspace Name</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="Enter workspace name"
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
                                    <p className="text-sm">Workspace Icon</p>
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
                        save Workspace
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
