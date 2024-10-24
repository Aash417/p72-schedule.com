'use client';

import ResponsiveModal from '@/components/responsive-modal';
import { useCreateWorkspaceModal } from '@/features/workspaces/hooks/use-create-workspace-modal';
import CreateWorkspaceForm from '@/features/workspaces/components/create-workspace-form';

export default function CreateWorkspaceModal() {
   const { isOpen, setIsOpen, close } = useCreateWorkspaceModal();

   return (
      <ResponsiveModal open={isOpen} onOpenchange={setIsOpen}>
         <CreateWorkspaceForm onCancel={close} />
      </ResponsiveModal>
   );
}
