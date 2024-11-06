'use client';

import DatePicker from '@/components/date-picker';
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import MemberAvatar from '@/features/members/components/member-avatar';
import ProjectAvatar from '@/features/projects/components/project-avatar';
import { useUpdateTask } from '@/features/tasks/api/use-updateTask';
import { createTasksSchema } from '@/features/tasks/schemas';
import { Task, TaskStatus } from '@/features/tasks/types';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type Props = {
   onCancel?: () => void;
   projectOptions: { id: string; name: string; imageUrl?: string }[];
   memberOptions: { id: string; name: string }[];
   initialValues: Task;
};

export default function EditTaskForm({
   onCancel,
   projectOptions,
   memberOptions,
   initialValues,
}: Readonly<Props>) {
   const { mutate: updateTask, isPending } = useUpdateTask();

   const form = useForm<z.infer<typeof createTasksSchema>>({
      resolver: zodResolver(
         createTasksSchema.omit({ workspaceId: true, description: true }),
      ),
      defaultValues: {
         ...initialValues,
         dueDate: initialValues.dueDate
            ? new Date(initialValues.dueDate)
            : undefined,
      },
   });

   function onSubmit(values: z.infer<typeof createTasksSchema>) {
      updateTask(
         { json: values, param: { taskId: initialValues.$id } },
         {
            onSuccess: () => {
               form.reset();
               onCancel?.();
            },
         },
      );
   }

   return (
      <Card className="h-full w-full border-none shadow-none">
         <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">Edit a task</CardTitle>
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
                              <FormLabel>Task Name</FormLabel>
                              <FormControl>
                                 <Input
                                    {...field}
                                    placeholder="Enter task name"
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Due date</FormLabel>
                              <FormControl>
                                 <DatePicker {...field} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="assigneeId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Assignee</FormLabel>
                              <Select
                                 defaultValue={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Selece assginee" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <FormMessage />
                                 <SelectContent>
                                    {memberOptions.map((member) => (
                                       <SelectItem
                                          key={member.id}
                                          value={member.id}
                                       >
                                          <div className="flex items-center gap-x-2">
                                             <MemberAvatar
                                                name={member.name}
                                                className="size-6"
                                             />
                                             {member.name}
                                          </div>
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Status</FormLabel>
                              <Select
                                 defaultValue={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Selece status" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <FormMessage />
                                 <SelectContent>
                                    <SelectItem value={TaskStatus.BACKLOG}>
                                       {' '}
                                       Backlog{' '}
                                    </SelectItem>
                                    <SelectItem value={TaskStatus.TODO}>
                                       Todo
                                    </SelectItem>
                                    <SelectItem value={TaskStatus.IN_PROGRESS}>
                                       In Progress
                                    </SelectItem>
                                    <SelectItem value={TaskStatus.IN_REVIEW}>
                                       In Review
                                    </SelectItem>
                                    <SelectItem value={TaskStatus.DONE}>
                                       Done
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="projectId"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Project</FormLabel>
                              <Select
                                 defaultValue={field.value}
                                 onValueChange={field.onChange}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder="Selece project" />
                                    </SelectTrigger>
                                 </FormControl>
                                 <FormMessage />
                                 <SelectContent>
                                    {projectOptions.map((project) => (
                                       <SelectItem
                                          key={project.id}
                                          value={project.id}
                                       >
                                          <div className="flex items-center gap-x-2">
                                             <ProjectAvatar
                                                name={project.name}
                                                image={project.imageUrl}
                                                className="size-6"
                                             />
                                             {project.name}
                                          </div>
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </FormItem>
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
                        Save changes
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
}
