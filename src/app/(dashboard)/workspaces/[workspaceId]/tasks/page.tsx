import { getCurrent } from '@/features/auth/queries';
import TaskViewSwitcher from '@/features/tasks/components/task-view-switcher';
import { redirect } from 'next/navigation';

export default function Page() {
   const user = getCurrent();
   if (!user) redirect('/sign-in');

   return (
      <div className="flex h-full flex-col">
         <TaskViewSwitcher />
      </div>
   );
}
