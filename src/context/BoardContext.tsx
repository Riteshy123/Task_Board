import React, { createContext, useContext, useReducer, useEffect } from "react";
import type { Board, Column, Task } from "../types";

interface State {
  boards: Board[];
}

type Action =
  | { type: "ADD_BOARD"; payload: Board }
  | { type: "DELETE_BOARD"; payload: string }
  | { type: "ADD_COLUMN"; payload: { boardId: string; column: Column } }
  | { type: "DELETE_COLUMN"; payload: { boardId: string; columnId: string } }
  | { type: "ADD_TASK"; payload: { boardId: string; columnId: string; task: Task } }
  | { type: "DELETE_TASK"; payload: { boardId: string; columnId: string; taskId: string } }
  | { type: "EDIT_TASK"; payload: { boardId: string; columnId: string; taskId: string; updatedTask: Partial<Task> } }
  | { type: "REORDER_TASK"; payload: { boardId: string; columnId: string; sourceIndex: number; destinationIndex: number } };

const initialState: State = { boards: [] };

const BoardContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => {} });

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_BOARD":
      return { ...state, boards: [...state.boards, action.payload] };
    case "DELETE_BOARD":
      return { ...state, boards: state.boards.filter(b => b.id !== action.payload) };
    case "ADD_COLUMN":
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? { ...b, columns: [...b.columns, action.payload.column] }
            : b
        ),
      };
    case "DELETE_COLUMN":
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? { ...b, columns: b.columns.filter(c => c.id !== action.payload.columnId) }
            : b
        ),
      };
    case "ADD_TASK":
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? {
                ...b,
                columns: b.columns.map(c =>
                  c.id === action.payload.columnId
                    ? { ...c, tasks: [...c.tasks, action.payload.task] }
                    : c
                ),
              }
            : b
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? {
                ...b,
                columns: b.columns.map(c =>
                  c.id === action.payload.columnId
                    ? { ...c, tasks: c.tasks.filter(t => t.id !== action.payload.taskId) }
                    : c
                ),
              }
            : b
        ),
      };
    case "EDIT_TASK":
      return {
        ...state,
        boards: state.boards.map(b =>
          b.id === action.payload.boardId
            ? {
                ...b,
                columns: b.columns.map(c =>
                  c.id === action.payload.columnId
                    ? {
                        ...c,
                        tasks: c.tasks.map(t =>
                          t.id === action.payload.taskId ? { ...t, ...action.payload.updatedTask } : t
                        ),
                      }
                    : c
                ),
              }
            : b
        ),
      };
    case "REORDER_TASK":
      return {
        ...state,
        boards: state.boards.map(b => {
          if (b.id !== action.payload.boardId) return b;
          return {
            ...b,
            columns: b.columns.map(c => {
              if (c.id !== action.payload.columnId) return c;
              const updatedTasks = Array.from(c.tasks);
              const [moved] = updatedTasks.splice(action.payload.sourceIndex, 1);
              updatedTasks.splice(action.payload.destinationIndex, 0, moved);
              return { ...c, tasks: updatedTasks };
            }),
          };
        }),
      };
    default:
      return state;
  }
};

export const BoardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const stored = localStorage.getItem("boards");
    return stored ? { boards: JSON.parse(stored) } : initialState;
  });

  useEffect(() => {
    localStorage.setItem("boards", JSON.stringify(state.boards));
  }, [state.boards]);

  return <BoardContext.Provider value={{ state, dispatch }}>{children}</BoardContext.Provider>;
};

export const useBoard = () => useContext(BoardContext);
