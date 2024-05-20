import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Connect from "./Connect";
import Login from "./Login";
import SignUp from "./SignUp";
import TeamPage from "./TeamPage";
import ProjectPage from "./ProjectPage";
import MonacoEditor from "./MonacoEditor";
import './index.css';
import './App.css';
import MainPage from "./MainPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path="/connect" element={<Connect/>} />
          <Route path="/main" element={<MainPage />}/>
          <Route path="/team/:teamName" element={<TeamPage/>} />
          <Route path="/:teamName/:projectName/:commitId" element={<ProjectPage/>} />
          <Route path="/editor/:teamName/:projectName/:commitId" element={<MonacoEditor/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;