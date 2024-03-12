import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Connect from "./Connect";
import CodeEditor from "./CodeEditor";
import './index.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/connect" element={<Connect/>} />
          <Route path="/editor/:editorId" element={<CodeEditor/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;