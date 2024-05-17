import React, { useCallback, useEffect, useState, useRef } from "react";
import { json, useParams } from "react-router-dom";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";
import tomorrowTheme from "monaco-themes/themes/Tomorrow-Night.json";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import API from "./BaseUrl";
import { useBeforeunload } from "react-beforeunload";

import DragnDrop from "./Components/DragnDrop";
import Directory from "./Components/Directory";
import Participants from "./Components/Participants";
import Header from "./Components/Header";

const MonacoEditor = () => {
  useBeforeunload((event) => event.preventDefault());
  //   const monaco = useMonaco();
  const [users, setUsers] = useState(["이현", "준형", "규민"]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
  const [lineIndex, setLineIndex] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [nickname, setNickname] = useState("");

  const client = useRef();
  let { editorId, teamName, commitId, projectName } = useParams();

  const editorRef = useRef(null);

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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  /**
   * Socket
   */
  useEffect(() => {
    connect();
    getNickname();

    if (commitId > 0) {
    }

    return () => disconnect();
  }, []);

  async function getNickname() {
    try {
      const res = await API.get("/user/nickname");

      setNickname(res.data);
    } catch (error) {
      console.error("error" + error);
    }
  }

  async function getCode(fileName) {
    try {
      const res = await API.get(
        `/snapshot/${teamName}/${projectName}?fileName=` + fileName
      );

      const parts = fileName.split("/");
      setSelectedMenu(parts[parts.length - 1]);
      setLanguage(languageList[fileName.split(".")[1]] || "javascript");
      if (languageList[fileName.split(".")[1]] === "json") {
        const json = JSON.stringify(res.data, null, 2);
        console.log(json);
        setCode(json);
      } else {
        setCode(res.data);
      }
      setFileName(fileName);
      subscribe(fileName);
    } catch (error) {
      console.error("error" + error);
    }
  }

  const deleteFile = (e) => {
    e.preventDefault();
    e.stopPropagation();

    alert("파일을 삭제하시겠습니까?");
  };

  const createFile = (fileName) => {
    alert(fileName);
  };

  const updateUsers = () => {
    API.post(`/editor/${editorId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  //   useEffect(() => {
  //     if (monaco) {
  //       monaco.editor.defineTheme("tomorrow", tomorrowTheme);
  //       monaco.editor.setTheme("tomorrow");
  //     }
  //   }, [monaco]);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://localhost:8080/stomp",
      onConnect: () => {
        subscribe();
      },
    });

    client.current.webSocketFactory = function () {
      return new SockJS("http://localhost:8080/stomp");
    };

    client.current.activate();
  };

  const publish = (inputCode, currentLine, type) => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: "/app/message",
      body: JSON.stringify({
        nickname: nickname,
        teamName: teamName,
        projectName: projectName,
        code: inputCode,
        line: currentLine, //현재 수정 중인 라인
        fileName: fileName,
        updateType: type, //update, delete, create
      }),
    });
  };

  const subscribe = (fileName) => {
    client.current.subscribe(
      `/subscribe/notice/${teamName}/${fileName}`,
      (body) => {
        const json_body = JSON.parse(body.body);
        if (json_body.nickname !== nickname) {
          setLineContent(json_body.line + 1, json_body.code, json_body.updateType);
        }
      }
    );
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  function setLineContent(lineNumber, newText, type) {
    const model = editorRef.current.getModel();

    if (!model) {
      console.error("모델이 없습니다.");
      return;
    }

    // 라인의 현재 내용을 가져옴
    const lineContent = model.getLineContent(lineNumber);
    const startColumn = 1;
    const endColumn = lineContent.length + 1;
    let edit = {};

    console.log(type);

    if (newText === lineContent) {
      return;
    }

    if (type === "delete") {
      edit = {
        range: new monaco_editor.Range(
          lineNumber,
          startColumn,
          lineNumber + 1,
          endColumn
        ),
        text: "",
        forceMoveMarkers: false,
      };
    } else if (type === "create") {
      edit = {
        range: new monaco_editor.Range(
          lineNumber + 1,
          startColumn,
          lineNumber + 1,
          endColumn
        ),
        text: newText,
        forceMoveMarkers: false,
      };
    } else {
      // 편집 내용을 설명하는 객체를 만듦
      edit = {
        range: new monaco_editor.Range(
          lineNumber,
          startColumn,
          lineNumber,
          endColumn
        ),
        text: newText,
        forceMoveMarkers: false,
      };
    }

    // 모델에 편집 내용을 적용
    model.applyEdits([edit]);
    console.log(edit);
  }

  const handleEditorChange = (value, e) => {
    const currentLine = editorRef.current.getPosition().lineNumber - 1;
    const lineValue = editorRef.current
      .getModel()
      .getLineContent(currentLine + 1);

    //setCurrentLine(currentLine);

    const deletedLines = e.changes
      .filter(
        (change) =>
          change.text === "" &&
          change.range.startLineNumber !== change.range.endLineNumber
      )
      .map((change) => change.range.startLineNumber);

    //console.log(e.changes);

    if (e.changes[0].text === "\n") {
      publish("", currentLine, "create");
      console.log("추가된 라인:", currentLine + 1);
    } else if (deletedLines.length > 0) {
      // 삭제된 라인이 있음
      console.log("삭제된 라인:", deletedLines);
      publish("", deletedLines, "delete");
    } else {
      publish(lineValue, currentLine, "update");
    }

    //setCode(value);
  };

  return (
    <>
      <Header
        teamName={teamName}
        projectName={projectName}
        fileName={selectedMenu}
        comment={"good"}
      />
      <div className="mainFrameRow" style={{ gap: "0" }}>
        <div className="col">
          {fileList.length > 0 && (
            <Directory
              paths={fileList}
              // paths={paths}
              getCode={getCode}
              createFile={createFile}
              deleteFile={(e) => deleteFile(e)}
              selectedMenu={selectedMenu}
              setSelectedMenu={setSelectedMenu}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            ></Directory>
          )}
          <Participants participants={users} isCollapsed={isCollapsed} />
        </div>
        <div className="mainFrameCol" style={{ gap: "20px" }}>
          {!code.length > 0 && (
            <DragnDrop
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              teamName={teamName}
              setFileList={setFileList}
              projectName={projectName}
            />
          )}
          <Editor
            language={language}
            defaultValue=""
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MonacoEditor;
