import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Connect from "./Connect";
import CodeEditor from "./CodeEditor";
import Login from "./Login";
import SignUp from "./SignUp";
import Scm from "./ScmPage";
import './index.css';
import './App.css';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/connect" element={<Connect/>} />
          <Route path="/editor/:editorId" element={<CodeEditor/>}/>
          <Route path="/scm" element={<Scm/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;