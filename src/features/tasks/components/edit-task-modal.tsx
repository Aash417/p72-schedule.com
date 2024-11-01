'use client';

import ResponsiveModal from '@/components/responsive-modal';
import EditTaskFormWrapper from '@/features/tasks/components/edit-tasks-form-wrapper';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';

export default function EditTaskModal() {
   const { taskId, close } = useEditTaskModal();

   return (
      <ResponsiveModal open={!!taskId} onOpenchange={close}>
         {taskId && <EditTaskFormWrapper id={taskId} onCancel={close} />}
      </ResponsiveModal>
   );
}
