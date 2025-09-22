import React, { useState } from "react";
import type { Task } from "../types";
import { useBoard } from "../context/BoardContext";

interface Props {
  task: Task;
  boardId: string;
  columnId: string;
}

export const TaskCard: React.FC<Props> = ({ task, boardId, columnId }) => {
  const { dispatch } = useBoard();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);

  const deleteTask = () => {
    if (confirm("Delete this task?")) {
      dispatch({ type: "DELETE_TASK", payload: { boardId, columnId, taskId: task.id } });
    }
  };

  const saveTask = () => {
    dispatch({
      type: "EDIT_TASK",
      payload: { boardId, columnId, taskId: task.id, updatedTask: { title, description, priority, dueDate } },
    });
    setIsEditing(false);
  };

  const priorityColor =
    priority === "high"
      ? "bg-red-200 text-red-800"
      : priority === "medium"
      ? "bg-yellow-200 text-yellow-800"
      : "bg-green-200 text-green-800";

  return (
    <div className="bg-white p-2 rounded shadow hover:shadow-md transition flex flex-col gap-1">
      <div className="flex justify-between items-start">
        {isEditing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-1 py-0.5 rounded text-sm flex-1"
          />
        ) : (
          <h4 className="font-medium text-gray-800 text-sm">{task.title}</h4>
        )}
        <div className="flex gap-1 ml-2">
          <button onClick={deleteTask} className="text-red-500 hover:text-red-700 text-xs">X</button>
          <button onClick={() => (isEditing ? saveTask() : setIsEditing(true))} className="text-blue-500 hover:text-blue-700 text-xs">
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border px-1 py-0.5 rounded text-xs w-full"
            rows={2}
          />
          <div className="mt-1 flex items-center gap-2">
            <label className="text-xs">Due Date:</label>
            <input
              type="date"
              value={new Date(dueDate).toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
              className="border px-1 py-0.5 rounded text-xs"
            />
          </div>
          <div className="mt-1 flex items-center gap-2">
            <label className="text-xs">Priority:</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])} className="border px-1 py-0.5 rounded text-xs">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </>
      ) : (
        <>
          {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
          <div className="flex justify-between items-center text-xs mt-1">
            <span className={`px-2 py-0.5 rounded ${priorityColor}`}>{task.priority}</span>
            <span className="text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        </>
      )}
    </div>
  );
};
