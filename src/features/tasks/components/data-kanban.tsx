import React, { useState } from 'react';
import { Tasks, TaskStatus } from '../types';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumnHeader from './kanban-column-header';

type Props = {
   data: Tasks[];
};
type TaskState = {
   [key in TaskStatus]: Tasks[];
};

const boards: TaskStatus[] = [
   TaskStatus.BACKLOG,
   TaskStatus.TODO,
   TaskStatus.IN_PROGRESS,
   TaskStatus.IN_REVIEW,
   TaskStatus.DONE,
];

export default function DataKanban({ data }: Props) {
   const [tasks] = useState<TaskState>(() => {
      const initialTasks: TaskState = {
         [TaskStatus.BACKLOG]: [],
         [TaskStatus.TODO]: [],
         [TaskStatus.IN_PROGRESS]: [],
         [TaskStatus.IN_REVIEW]: [],
         [TaskStatus.DONE]: [],
      };

      data.forEach((task) => {
         initialTasks[task.status].push(task);
      });

      Object.keys(initialTasks).forEach((status) => {
         initialTasks[status as TaskStatus].sort(
            (a, b) => a.position - b.position,
         );
      });
      return initialTasks;
   });

   return (
      <DragDropContext onDragEnd={() => { }}>
         <div className="flex overflow-x-auto">
            {boards.map((board) => {
               return (
                  <div
                     key={board}
                     className="mx-2 min-w-[200px] flex-1 rounded-md bg-muted p-1.5"
                  >
                     <KanbanColumnHeader
                        board={board}
                        taskCount={tasks[board].length}
                     />
                  </div>
               );
            })}
         </div>
      </DragDropContext>
   );
}
