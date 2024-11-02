import KanbanCard from '@/features/tasks/components/kanban-card';
import KanbanColumnHeader from '@/features/tasks/components/kanban-column-header';
import { Task, TaskStatus } from '@/features/tasks/types';
import {
   DragDropContext,
   Draggable,
   Droppable,
   type DropResult,
} from '@hello-pangea/dnd';
import { useCallback, useEffect, useState } from 'react';

type Props = {
   data: Task[];
   onChange: (
      tasks: { $id: string; status: TaskStatus; position: number }[],
   ) => void;
};
type TaskState = {
   [key in TaskStatus]: Task[];
};

const boards: TaskStatus[] = [
   TaskStatus.BACKLOG,
   TaskStatus.TODO,
   TaskStatus.IN_PROGRESS,
   TaskStatus.IN_REVIEW,
   TaskStatus.DONE,
];

export default function DataKanban({ data, onChange }: Props) {
   const [tasks, setTasks] = useState<TaskState>(() => {
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

   useEffect(() => {
      const newTasks: TaskState = {
         [TaskStatus.BACKLOG]: [],
         [TaskStatus.TODO]: [],
         [TaskStatus.IN_PROGRESS]: [],
         [TaskStatus.IN_REVIEW]: [],
         [TaskStatus.DONE]: [],
      };

      data.forEach((task) => {
         newTasks[task.status].push(task);
      });

      Object.keys(newTasks).forEach((status) => {
         newTasks[status as TaskStatus].sort((a, b) => a.position - b.position);
      });

      setTasks(newTasks);
   }, [data]);

   const onDragEnd = useCallback(
      (result: DropResult) => {
         if (!result.destination) return;

         const { source, destination } = result;
         const sourceStatus = source.droppableId as TaskStatus;
         const destStatus = destination.droppableId as TaskStatus;

         let updatesPayload: {
            $id: string;
            status: TaskStatus;
            position: number;
         }[] = [];

         setTasks((prevTasks) => {
            const newTasks = { ...prevTasks };

            // remove the task from the source column
            const sourceColumn = [...newTasks[sourceStatus]];
            const [movedTasks] = sourceColumn.splice(source.index, 1);

            // if ther is no moved task , return prev state
            if (!movedTasks) {
               console.error('no task found at the source index');
               return prevTasks;
            }

            //create new task obj with updated status
            const updatedMovedTask =
               sourceStatus !== destStatus
                  ? { ...movedTasks, status: destStatus }
                  : movedTasks;

            // update the source column
            newTasks[sourceStatus] = sourceColumn;

            // add the task to destination column
            const destColumn = [...newTasks[destStatus]];
            destColumn.splice(destination.index, 0, updatedMovedTask);
            newTasks[destStatus] = destColumn;

            // prepare minimal update payloads
            updatesPayload = [];

            // always update the moved task
            updatesPayload.push({
               $id: updatedMovedTask.$id,
               status: destStatus,
               position: Math.min((destination.index + 1) * 1000, 1_000_000),
            });

            // update position for affected tasks in dest col
            newTasks[destStatus].forEach((task, index) => {
               if (task && task.$id !== updatedMovedTask.$id) {
                  const newPosition = Math.min((index + 1) * 1000, 1_000_000);

                  if (task.position !== newPosition) {
                     updatesPayload.push({
                        $id: task.$id,
                        status: destStatus,
                        position: newPosition,
                     });
                  }
               }
            });

            // if the task moved between cols , update the position in source destination
            if (sourceStatus !== destStatus) {
               newTasks[sourceStatus].forEach((task, index) => {
                  if (task) {
                     const newPosition = Math.min(
                        (index + 1) * 1000,
                        1_000_000,
                     );

                     if (task.position !== newPosition) {
                        updatesPayload.push({
                           $id: task.$id,
                           status: sourceStatus,
                           position: newPosition,
                        });
                     }
                  }
               });
            }

            return newTasks;
         });
         onChange(updatesPayload);
      },
      [onChange],
   );

   return (
      <DragDropContext onDragEnd={onDragEnd}>
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
                     <Droppable droppableId={board}>
                        {(provided) => (
                           <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="min-h-[200px] py-1.5"
                           >
                              {tasks[board].map((task, index) => (
                                 <Draggable
                                    draggableId={task.$id}
                                    index={index}
                                    key={task.$id}
                                 >
                                    {(provided) => (
                                       <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                       >
                                          <KanbanCard task={task} />
                                       </div>
                                    )}
                                 </Draggable>
                              ))}
                              {provided.placeholder}
                           </div>
                        )}
                     </Droppable>
                  </div>
               );
            })}
         </div>
      </DragDropContext>
   );
}
