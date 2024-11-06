import { useParams } from 'next/navigation';

export function useWorkspaceId() {
   const { workspaceId } = useParams();

   return workspaceId as string;
}
