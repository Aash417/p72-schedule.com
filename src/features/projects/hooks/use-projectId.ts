import { useParams } from 'next/navigation';

export const useProjectId = () => {
   const { projectId } = useParams();

   return projectId as string;
};
