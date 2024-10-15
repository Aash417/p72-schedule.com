import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { z } from 'zod';
import { useRegister } from '../api/use-register';
import { SignUpSchema } from '../schemas';

export const SignUpCard = () => {
   const { mutate } = useRegister();

   const form = useForm<z.infer<typeof SignUpSchema>>({
      resolver: zodResolver(SignUpSchema),
      defaultValues: { name: '', email: '', password: '' },
   });

   const onSubmit = (values: z.infer<typeof SignUpSchema>) =>
      mutate({ json: values });

   return (
      <Card className="h-full w-full border-none shadow-none md:w-[487px]">
         <CardHeader className="flex items-center justify-center p-7 text-center">
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>
               By signing up, you are agree to our {''}
               <Link href="/privacy">
                  <span className="text-blue-700">Privacy policy</span>
               </Link>
               and
               <Link href="/terms">
                  <span className="text-blue-700">Terms of Service</span>
               </Link>
            </CardDescription>
         </CardHeader>

         <div className="px-7">
            <DottedSeparator />
         </div>

         <CardContent className="p-7">
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormField
                     name="name"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="text"
                                 placeholder="Enter your name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     name="email"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="Enter email address"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     name="password"
                     control={form.control}
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="Enter password"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <Button disabled={false} size="lg" className="w-full">
                     Login
                  </Button>
               </form>
            </Form>
         </CardContent>

         <div className="flex flex-col gap-y-4">
            <DottedSeparator />
            <CardContent>
               <Button variant="secondary" size="lg" className="w-full">
                  <FcGoogle className="mr-2 size-5" />
                  Login with Google
               </Button>
            </CardContent>
         </div>

         <div className="">
            <DottedSeparator />
            <CardContent className="flex items-center justify-center p-7">
               <p className="items-center">
                  Already have an account ?
                  <Link href="/sign-in">
                     <span className="text-blue-700">&nbsp;Sing In</span>
                  </Link>
               </p>
            </CardContent>
         </div>
      </Card>
   );
};
