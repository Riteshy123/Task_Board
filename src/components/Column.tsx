import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";
import { TaskCard } from "./TaskCard";
import type { Column as ColumnType, Task } from "../types";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { DropResult } from "react-beautiful-dnd";

interface ColumnProps {
  column: ColumnType;
  boardId: string;
}

export const Column: React.FC<ColumnProps> = ({ column, boardId }) => {
  const { dispatch } = useBoard();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  const [taskDueDate, setTaskDueDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const [searchText, setSearchText] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"" | Task["priority"]>("");
  const [dueDateFilter, setDueDateFilter] = useState("");

  const addTask = () => {
    if (!taskTitle) return;
    const newTask: Task = { id: uuid(), title: taskTitle, description: "", priority: taskPriority, createdBy: "You", dueDate: taskDueDate };
    dispatch({ type: "ADD_TASK", payload: { boardId, columnId: column.id, task: newTask } });
    setTaskTitle(""); setTaskPriority("medium"); setTaskDueDate(new Date().toISOString().split("T")[0]);
  };

  const deleteColumn = () => {
    if (confirm("Delete this column?")) dispatch({ type: "DELETE_COLUMN", payload: { boardId, columnId: column.id } });
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    dispatch({ type: "REORDER_TASK", payload: { boardId, columnId: column.id, sourceIndex: source.index, destinationIndex: destination.index } });
  };

  const filteredTasks = column.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase()) || task.description.toLowerCase().includes(searchText.toLowerCase());
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesDueDate = dueDateFilter ? new Date(task.dueDate).toISOString().split("T")[0] === dueDateFilter : true;
    return matchesSearch && matchesPriority && matchesDueDate;
  });

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex-shrink-0 w-80 shadow-lg hover:shadow-xl transition flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800 text-lg">{column.title}</h3>
        <button onClick={deleteColumn} className="text-red-500 hover:text-red-700 text-sm font-bold">X</button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 mb-3 p-3 bg-white rounded shadow-sm">
        <input type="text" placeholder="Search..." value={searchText} onChange={e => setSearchText(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm" />
        <div className="flex gap-2 mt-1">
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as "" | Task["priority"])}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm shadow-sm">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <input type="date" value={dueDateFilter} onChange={e => setDueDateFilter(e.target.value)}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm shadow-sm" />
        </div>
      </div>

      {/* Add Task */}
      <div className="flex flex-col gap-2 p-3 bg-white rounded shadow-sm">
        <input value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Task title"
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm" />
        <div className="flex gap-2">
          <select value={taskPriority} onChange={e => setTaskPriority(e.target.value as "high"|"medium"|"low")}
            className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm shadow-sm">
            <option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <button onClick={addTask} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm shadow-sm transition">Add</button>
        </div>
      </div>

      {/* Tasks */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={column.id} isDropDisabled={false}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 mb-3 max-h-[450px] overflow-y-auto">
              {filteredTasks.length === 0 && <div className="text-gray-400 text-sm p-2 text-center italic">No tasks found</div>}
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                      style={{ ...provided.draggableProps.style, boxShadow: snapshot.isDragging ? "0 0 10px rgba(0,0,0,0.2)" : undefined }}>
                      <TaskCard task={task} boardId={boardId} columnId={column.id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
