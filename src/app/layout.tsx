import QueryProvider from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
   title: 'Schedule.com',
   description: 'Manage your projects and tasks all in one place',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={cn(inter.className, 'min-h-screen antialiased')}>
            <QueryProvider>
               <ReactQueryDevtools initialIsOpen={false} />
               <Toaster />
               {children}
               <Analytics />
            </QueryProvider>
         </body>
      </html>
   );
}
