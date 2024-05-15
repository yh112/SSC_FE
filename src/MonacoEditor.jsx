import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco from 'monaco-editor';
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
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const [users, setUsers] = useState(["이현", "준형", "규민"]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
  const [lineIndex, setLineIndex] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [type, setType] = useState("update");
  const [cursor, setCursor] = useState(0);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  const client = useRef();
  //   let { editorId, teamName, commitId, projectName } = useParams();
  let { teamName, commitId, projectName } = useParams();

  const editorId = "user1";

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }


  /**
   * Socket
   */
  useEffect(() => {
    connect();
    //updateUsers()

    if (commitId > 0) {
    }
    return () => disconnect();
  }, []);

  async function getCode(fileName) {
    try {
      const res = await API.get(
        `/snapshot/${teamName}/${projectName}?fileName=` + fileName
      );

      setLanguage(fileName.split(".")[1]);
      setCode(res.data);
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

  const publish = (inputCode) => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: "/app/message",
      body: JSON.stringify({
        teamName: teamName,
        projectName: projectName,
        code: inputCode,
        line: currentLine, //현재 수정 중인 라인
        start: lineIndex.start, // 현재 수정 중인 라인의 시작점
        end: lineIndex.end, // 현재 수정 중인 라인의 끝
        cursorStart: cursorStart,
        cursorEnd: cursorEnd,
        fileName: fileName,
        updateType: type, //update, delete, create
      }),
    });
  };

  useEffect(() => {
    // textRef.current.setSelectionRange(cursor, cursor);
    console.log("cursor: " + cursor);
  }, [cursor]);

  const subscribe = (fileName) => {
    client.current.subscribe(
      `/subscribe/notice/${teamName}/${fileName}`,
      (body) => {
        const json_body = JSON.parse(body.body);

        setCursor(json_body.cursorStart);
        // changeCode(json_body.code, false);
      }
    );
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  const handleEditorChange = (value, e) => {
    // console.log(e);
    console.log(e.changes);
    setCode(value);
    // console.log(editorRef.current.getRange(1));
    // console.log(value);
  };

  const searchCurrentLine = (start, end) => {
    console.log("되냐고?");
    // 키다운 이벤트 처리 -> 현재 커서 위치(start, end, linecount)
    // 체인지 이벤트 처리 ->
    const startNum = code.lastIndexOf("\n", start);
    const endNum = code.indexOf("\n", end);

    console.log("startNum: " + startNum + " endNum: " + endNum);

    const lineStart =
      startNum < 0 ? 0 : startNum === endNum ? start : startNum + 1; // 현재 라인이 첫번째 라인일 때는 0, 커서 앞에 개행이 있으면 커서의 위치, 아니면 startNum + 1
    const lineEnd =
      endNum < 0 ? code.length - 1 : startNum === endNum ? end : endNum - 1; // 현재 라인이 마지막 라인일 때는 code.length - 1, 커서 뒤에 개행이 있으면 커서의 위치, 아니면 endNum - 1

    let lineNumber = 0;
    let index = 0;

    while (index <= start) {
      console.log(
        "index: " + index + " start: " + start + " text: " + code[start]
      );
      index = code.indexOf("\n", index) + 1;
      lineNumber++;
    }

    console.log(
      "start: " +
        start +
        " end: " +
        end +
        " line: " +
        lineNumber +
        " lineStart: " +
        lineStart +
        " lineEnd: " +
        lineEnd
    );

    setCursorStart(start);
    setCursorEnd(end);
    setCurrentLine(lineNumber - 1);
    setLineIndex({ start: lineStart, end: lineEnd });
  };

  return (
    <>
      <Header
        teamName={teamName}
        projectName={projectName}
        fileName={fileName}
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
          {/* <List className="listText" elementClassName="listElementText" listNames={users} onClick='none'/> */}
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
            defaultLanguage={language}
            defaultValue=""
            value={code}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            onKeydown={(e) =>
              searchCurrentLine(e.target.selectionStart, e.target.selectionEnd)
            }
            options={{
              minimap: { enabled: false },
              fontSize: 18,
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
