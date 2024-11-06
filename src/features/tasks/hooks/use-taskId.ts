import { useParams } from 'next/navigation';

export const useTaskId = () => {
   const { taskId } = useParams();

   return taskId as string;
};
