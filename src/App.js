import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Connect from "./Connect";
//import CodeEditor from "./CodeEditor";
import StringCodeEditor from "./StringCodeEditor";
import CodeEditor from "./CodeEditor2";
import Login from "./Login";
import SignUp from "./SignUp";
import Scm from "./ScmPage";
import TeamPage from "./TeamPage";
import ProjectPage from "./ProjectPage";
import MonacoEditor from "./MonacoEditor";
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
          {/* <Route path="/editor/:teamName/:commitId" element={<CodeEditor/>}/> */}
          {/* <Route path="/editor/:teamName/:projectName/:commitId" element={<StringCodeEditor/>}/> */}
          {/* commitId == 0 -> 새로운 프로젝트 쉐어
          commitId != 0 -> 이전에 올린 커밋 불러와서 쉐어  */}
          {/* <Route path="/test/:teamName/:projectName/:commitId" element={<CodeEditor/>}/> */}
          <Route path="/scm" element={<Scm/>} />
          <Route path="/team/:teamName" element={<TeamPage/>} />
          <Route path="/:teamName/:projectName/:commitId" element={<ProjectPage/>} />
          <Route path="/editor/:teamName/:projectName/:commitId" element={<MonacoEditor/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;