import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "./BaseUrl";
import axios from "axios";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Directory from "./Components/Directory";
import ProjectHeader from "./Components/ProjectHeader";
import Editor from "@monaco-editor/react";

//디렉토리 구조
//파일 누르면 코드 보여주기
function ProjectPage() {
  const { projectName, commitId } = useParams();
  const [code, setCode] = useState("");
  // const [paths, setPaths] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [fileList, setFileList] = useState([]);
  const [language, setLanguage] = useState("");

  const languageList = {
    jsx: "javascript",
    js: "javascript",
    tsx: "typescript",
    ts: "typescript",
    java: "java",
    cpp: "cpp",
    c: "c",
    py: "python",
    json: "json",
    html: "html",
    css: "css",
    md: "markdown",
  };

  // 프로젝트 정보 가져오기
  async function getProject() {
    try {
      const res = await API.get(`/manage/${commitId}`);

      setFileList(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCode(fileName) {
    try {
      const res = await axios.get(
        `https://seumu-s3-bucket.s3.ap-northeast-2.amazonaws.com/${fileName}`
      );
      setLanguage(languageList[fileName.split(".")[1]] || "javascript");
      setSelectedMenu(fileName.split("/")[2]);
      if (languageList[fileName.split(".")[1]] === "json") {
        const json = JSON.stringify(res.data, null, 2);
        console.log(json);
        setCode(json);
      } else {
        setCode(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  // 마운트할 때 프로젝트 정보 가져오기
  useEffect(() => {
    getProject();
  }, []);

  // 코드가 변경되면 하이라이트 적용
  useEffect(() => {
    hljs.highlightAll();
  }, [code]);

  // 선택한 메뉴가 바뀔 때마다 코드를 가져옴
  useEffect(() => {
    console.log(selectedMenu);
  }, [selectedMenu]);

  const navigate = useNavigate();

  const openCodeEditor = () => {
    navigate("/connect");
  };

  return (
    <>
      <ProjectHeader
        teamName="teamName"
        projectName={projectName}
        fileName={selectedMenu}
        code={code}
      />
      <div className="projectPage">
        {fileList.length > 0 && (
          <Directory
            paths={fileList}
            setCode={setCode}
            getCode={getCode}
            selectedMenu={selectedMenu}
            setSelectedMenu={setSelectedMenu}
          />
        )}
        {/* <div className="code-editor" style={{ height: "100%", padding: "0" }}>
        <div className="topFrameBetween">
          <h4>{selectedMenu}</h4>
          <button className="miniButton" style={{ background: "#FF7A00", color: "#FFFFFF"}} onClick={openCodeEditor}>Code Editor</button>
        </div>
        <pre className="code-editor__present" style={{ padding: "0" }}>
          <code style={{ padding: "0" }}>{code}</code>
        </pre>
      </div> */}
        {selectedMenu !== "" && (
        <Editor
          language={language}
          defaultValue=""
          value={code}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: true,
          }}
        />
        )}
      </div>
    </>
  );
}

export default ProjectPage;
