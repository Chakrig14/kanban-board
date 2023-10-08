import Home from "./components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TaskModal from "./components/TaskModal";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks/:id" element={<TaskModal />} />
      </Routes>
    </Router>
  );
}

export default App;
