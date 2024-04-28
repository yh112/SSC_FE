import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "./BaseUrl";
import List from "./Components/List";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import Directory from "./Components/Directory";
import { drawSelection } from "@uiw/react-codemirror";

//디렉토리 구조
//파일 누르면 코드 보여주기
function ProjectPage() {
  const { projectName, commitId } = useParams();
  const [code, setCode] = useState("");
  // const [paths, setPaths] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("");
  const [fileList, setFileList] = useState([]);

  let paths = [
    "front2/src/Component/BackButton.jsx",
    "front2/src/Component/CloseButton.jsx",
    "front2/src/Component/CommitList.jsx",
    "front2/public/index.html",
    "front2/RAEDME.md",
    "front2/public/favicon.ico",
  ];

  // const [code] = useState(`
  //   import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
  //   import software.amazon.awssdk.core.sync.RequestBody;
  //   import software.amazon.awssdk.core.waiters.WaiterResponse;
  // `);

  // 메뉴 클릭 시 해당 메뉴의 경로 찾기
  const getSnapshotId = () => {


  };

  // 메뉴의 코드 가져오기
  const getCode = () => {

  }

  // 프로젝트 정보 가져오기
  async function getProject() {
    try {
      const res = await API.get(`/manage/${commitId}`)

      setFileList(res.data);
    } catch (error) {
      console.error(error)
    }
  };

  // 마운트할 때 프로젝트 정보 가져오기
  useEffect(() => {
    getProject();
  }, []);

  // 코드가 변경되면 하이라이트 적용
  useEffect(() => {
    hljs.highlightAll();
  }, [code]);

  // 선택한 메뉴가 바뀔 때마다 코드를 가져옴
  useEffect(() => {}, [selectedMenu]);

  const openCodeEditor = () => {
    //
  };

  return (
    <div className="projectPage">
      {fileList.length > 0 &&
        <Directory
          paths={fileList}
          setCode={setCode}
          selectedMenu={selectedMenu}
          setSelectedMenu={setSelectedMenu}
        />}
      <div className="code-editor" style={{ height: "100%", padding: "0" }}>
        <h4>{selectedMenu}</h4>
        <pre className="code-editor__present" style={{ padding: "0" }}>
          <code style={{ padding: "0" }}>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export default ProjectPage;
