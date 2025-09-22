import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import { Column } from "./Column";
import { v4 as uuid } from "uuid";

export const BoardDetail: React.FC = () => {
  const { id } = useParams();
  const { state, dispatch } = useBoard();
  const board = state.boards.find(b => b.id === id);

  const [colTitle, setColTitle] = useState("");
  const [searchColText, setSearchColText] = useState("");

  if (!board) return <div className="p-6">Board not found</div>;

  const addColumn = () => {
    if (!colTitle) return;
    dispatch({ type: "ADD_COLUMN", payload: { boardId: board.id, column: { id: uuid(), title: colTitle, tasks: [] } } });
    setColTitle("");
  };

  const filteredColumns = board.columns.filter(col =>
    col.title.toLowerCase().includes(searchColText.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center w-full max-w-5xl mb-6 px-4">
        <h1 className="text-3xl font-bold text-gray-800">{board.title}</h1>
        <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow transition font-medium">Back</Link>
      </div>

      {/* Add Column */}
      <div className="flex flex-wrap sm:flex-row gap-2 mb-4 items-center">
        <input value={colTitle} onChange={e => setColTitle(e.target.value)} placeholder="Column title"
          className="border border-gray-300 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm w-1/2" />
        <button onClick={addColumn} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow transition text-sm font-medium">Add Column</button>
      </div>

      {/* Column Search */}
      <div className="mb-4">
        <input value={searchColText} onChange={e => setSearchColText(e.target.value)} placeholder="Search columns..."
          className="w-full max-w-sm border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm shadow-sm" />
      </div>

      <div className="flex gap-4 overflow-x-auto">
        {filteredColumns.length > 0 ? filteredColumns.map(col => <Column key={col.id} column={col} boardId={board.id} />) :
          <div className="text-gray-400 text-sm italic p-2">No columns found.</div>}
      </div>
    </div>
  );
};
