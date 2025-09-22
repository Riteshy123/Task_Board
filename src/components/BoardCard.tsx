import React from "react";
import type { Board } from "../types";
import { Link } from "react-router-dom";

interface BoardCardProps {
  board: Board;
  onDelete: (id: string) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, onDelete }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition w-full">
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">{board.title}</h2>
        <p className="text-sm text-gray-500">
          {board.columns.length} Column{board.columns.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Link
          to={`/board/${board.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View
        </Link>
        <button
          className="text-red-500 hover:text-red-700 font-medium"
          onClick={() => onDelete(board.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
