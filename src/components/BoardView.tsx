import React, { useState } from "react";
import { useBoard } from "../context/BoardContext";
import { BoardCard } from "./BoardCard";
import type { Board } from "../types";
import { v4 as uuid } from "uuid";

export const BoardView: React.FC = () => {
  const { state, dispatch } = useBoard();
  const [title, setTitle] = useState("");

  const addBoard = () => {
    if (!title) return;
    const newBoard: Board = {
      id: uuid(),
      title,
      createdAt: new Date().toISOString(),
      columns: []
    };
    dispatch({ type: "ADD_BOARD", payload: newBoard });
    setTitle("");
  };

  const deleteBoard = (id: string) => {
    if (confirm("Delete this board?")) {
      dispatch({ type: "DELETE_BOARD", payload: id });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Boards</h1>

      <div className="flex gap-2 mb-8">
        <input
          className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Board title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-lg shadow transition"
          onClick={addBoard}
        >
          Add Board
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {state.boards.map(board => (
          <BoardCard key={board.id} board={board} onDelete={deleteBoard} />
        ))}
      </div>
    </div>
  );
};
