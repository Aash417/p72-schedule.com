'use client';

import ResponsiveModal from '@/components/responsive-modal';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import CreateTaskFormWrapper from '@/features/tasks/components/create-tasks-form-wrapper';

export default function createTaskModal() {
   const { isOpen, setIsOpen, close } = useCreateTaskModal();

   return (
      <ResponsiveModal open={isOpen} onOpenchange={setIsOpen}>
         <CreateTaskFormWrapper onCancel={close} />
      </ResponsiveModal>
   );
}
