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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateWorkspace } from '../api/use-createWorkspace';
import { createWorkspacesSchema } from '../schemas';

type Props = {
   onCancel?: () => void;
};

export default function CreateWorkspaceForm({ onCancel }: Readonly<Props>) {
   const { mutate, isPending } = useCreateWorkspace();

   const form = useForm({
      resolver: zodResolver(createWorkspacesSchema),
      defaultValues: {
         name: '',
      },
   });

   function onSubmit(values: z.infer<typeof createWorkspacesSchema>) {
      mutate({ json: values });
      form.reset();
   }
   return (
      <Card className="h-full w-full border-none shadow-none">
         <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
               Create a new workspace
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
                        render={({ field }) => {
                           return (
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
                           );
                        }}
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
                     >
                        Cancel
                     </Button>
                     <Button size="lg" disabled={isPending}>
                        Create Workspace
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
