import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Connect from "./Connect";
import CodeEditor from "./CodeEditor";
import Login from "./Login";
import SignUp from "./SignUp";
import Scm from "./ScmPage";
import TeamPage from "./TeamPage";
import ProjectPage from "./ProjectPage";
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
          <Route path="/team/:teamName" element={<TeamPage/>} />
          <Route path="/team/:teamName/project/:projectName" element={<ProjectPage/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;