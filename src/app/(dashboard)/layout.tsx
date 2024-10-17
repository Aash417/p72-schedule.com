import Navbar from '@/components/navbar';
import Sidebar from '@/components/sidebar';

type Props = { children: React.ReactNode };

export default function DashboardLayout({ children }: Readonly<Props>) {
   return (
      <div className="min-h-screen">
         <div className="flex h-full w-full">
            <div className="fixed left-0 top-0 hidden h-full overflow-y-auto lg:block lg:w-[264px]">
               <Sidebar />
            </div>

            <div className="w-full lg:pl-[264px]">
               <div className="mx-auto h-full max-w-screen-2xl">
                  <Navbar />

                  <main className="flex h-full flex-col px-8 py-8">
                     {children}
                  </main>
               </div>
            </div>
         </div>
      </div>
   );
}
