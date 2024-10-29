import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { TaskStatus } from '@/features/tasks/types';

export function useTaskFilters() {
   return useQueryStates({
      projectId: parseAsString,
      assigneeId: parseAsString,
      dueDate: parseAsString,
      search: parseAsString,
      status: parseAsStringEnum(Object.values(TaskStatus)),
   });
}
