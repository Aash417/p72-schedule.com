import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-getProjectAnalytics';
import AnalyticsCard from './analytics-card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export default function Analytics({ data }: ProjectAnalyticsResponseType) {
   return (
      <ScrollArea className="w-full shrink-0 whitespace-nowrap rounded-lg border">
         <div className="flex w-full flex-row">
            <div className="flex flex-1 items-center">
               <AnalyticsCard
                  title="Total tasks"
                  value={data.taskCount}
                  variant={data.taskDifference > 0 ? 'up' : 'down'}
                  increaseValue={data.taskDifference}
               />
            </div>

            <div className="flex flex-1 items-center">
               <AnalyticsCard
                  title="Assigned Task"
                  value={data.assignedTaskCount}
                  variant={data.assignedTaskDifference > 0 ? 'up' : 'down'}
                  increaseValue={data.assignedTaskDifference}
               />
            </div>

            <div className="flex flex-1 items-center">
               <AnalyticsCard
                  title="Incomplete Task"
                  value={data.incompletedTaskCount}
                  variant={data.incompelteTaskDifference > 0 ? 'up' : 'down'}
                  increaseValue={data.incompelteTaskDifference}
               />
            </div>

            <div className="flex flex-1 items-center">
               <AnalyticsCard
                  title="Overdue Task"
                  value={data.overdueTasksCount}
                  variant={data.overdueTasksDifference > 0 ? 'up' : 'down'}
                  increaseValue={data.overdueTasksDifference}
               />
            </div>

            <div className="flex flex-1 items-center">
               <AnalyticsCard
                  title="Completed Task"
                  value={data.completedTasksCount}
                  variant={data.compeltedTasksDifference > 0 ? 'up' : 'down'}
                  increaseValue={data.compeltedTasksDifference}
               />
            </div>
         </div>

         <ScrollBar orientation="horizontal" />
      </ScrollArea>
   );
}
