import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon } from 'lucide-react';

export default function TaskViewSwitcher() {
   return (
      <Tabs className="w-full flex-1 rounded-lg border">
         <div className="flex h-full flex-col overflow-auto p-4">
            <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
               <TabsList className="w-full lg:w-auto">
                  <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                     Table
                  </TabsTrigger>
                  <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                     Kanban
                  </TabsTrigger>
                  <TabsTrigger
                     value="calender"
                     className="h-8 w-full lg:w-auto"
                  >
                     Calender
                  </TabsTrigger>
               </TabsList>

               <Button size="sm" className="w-full lg:w-auto">
                  <PlusIcon className="mr-2 size-4" />
                  New
               </Button>
            </div>
            <DottedSeparator className="my-7" />
            Data filters
            <DottedSeparator className="my-7" />
            <>
               <TabsContent value="table" className="mt-0">
                  Data table
               </TabsContent>
               <TabsContent value="kanban" className="mt-0">
                  Data Kanban
               </TabsContent>
               <TabsContent value="calender" className="mt-0">
                  Data Calender
               </TabsContent>
            </>
         </div>
      </Tabs>
   );
}
