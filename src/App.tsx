import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { BoardProvider } from "./context/BoardContext";
import { BoardView } from "./components/BoardView";
import { BoardDetail } from "./components/BoardDetail";

const App: React.FC = () => {
  return (
    <BoardProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BoardView />} />
          <Route path="/board/:id" element={<BoardDetail />} />
        </Routes>
      </Router>
    </BoardProvider>
  );
};

export default App;
