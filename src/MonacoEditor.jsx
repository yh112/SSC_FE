import React, { useCallback, useEffect, useState, useRef } from "react";
import { json, useParams } from "react-router-dom";
import Editor, { useMonaco } from "@monaco-editor/react";
import * as monaco_editor from "monaco-editor";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import API from "./BaseUrl";
import { useBeforeunload } from "react-beforeunload";

import DragnDrop from "./Components/DragnDrop";
import Directory from "./Components/Directory";
import Participants from "./Components/Participants";
import Header from "./Components/Header";
import Modal from "./Components/Modal";
import { edit } from "ace-builds";
import { editor } from "monaco-editor";

const MonacoEditor = () => {
  useBeforeunload((event) => event.preventDefault());
  //   const monaco = useMonaco();
  const [users, setUsers] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [lineIndex, setLineIndex] = useState([]);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [nickname, setNickname] = useState("");
  const [otherUserCursors, setOtherUserCursors] = useState([]);
  const [comment, setComment] = useState("");
  const [active, setActive] = useState(false);
  let bracket = 0;

  const isApplyingEdits = useRef(false);

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
    editor.onDidChangeCursorPosition((e) => {
      console.log("커서 위치: ", e.position);
    });
  }

  /**
   * Socket
   */
  useEffect(() => {
    connect();
    getNickname();

    if (commitId == "share") {
      getSnapshotList();
    } else if (commitId > 0) {
      getCommitSnapshot();
    } else if (commitId == "new") {

    }

    return () => disconnect();
  }, []);

  async function getNickname() {
    try {
      const res = await API.get("/user/nickname");

      setNickname(res.data);
      setUsers([...users, res.data]);
      console.log(users);
    } catch (error) {
      console.error("error" + error);
    }
  }

  async function getSnapshotList() {
    try {
      const res = await API.get(`/snapshot/list/${teamName}/${projectName}`);

      setFileList(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function getCommitSnapshot() {
    try {
      const res = await API.post(`/snapshot/change`, {
        commitId: commitId,
        teamName: teamName,
        projectName: projectName
      });

      setFileList(res.data);
    } catch (error) {
      console.error(error);
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
      //   brokerURL: "wss://server.sit-hub.com/stomp",
      // brokerURL: process.env.REACT_APP_BROKERURL,
      brokerURL: "ws://localhost:8080/stomp",
      onConnect: () => {
        subscribe();
      },
    });

    client.current.webSocketFactory = function () {
      //   return new SockJS("https://server.sit-hub.com/stomp");
      // return new SockJS(process.env.REACT_APP_SOCKJSURL);
      return new SockJS("http://localhost:8080/stomp");
    };

    client.current.activate();
  };

  const publish = (inputCode, currentLine, type, cursorStart, cursorEnd) => {
    if (!client.current.connected) return;
    console.log("pub: ", cursorStart, cursorEnd);

    client.current.publish({
      destination: "/app/message",
      body: JSON.stringify({
        nickname: nickname,
        teamName: teamName,
        projectName: projectName,
        code: inputCode,
        line: currentLine, //현재 수정 중인 라인
        start: cursorStart,
        end: cursorEnd,
        fileName: fileName,
        updateType: type, //update, delete, create, position
      }),
    });
  };

  const subscribe = (fileName) => {
    client.current.subscribe(
      `/subscribe/notice/${teamName}/${fileName}`,
      (body) => {
        const json_body = JSON.parse(body.body);
        if (json_body.nickname !== nickname) {
          console.log(json_body);
          setLineContent(
            json_body.line, // 프론트에선 1부터 시작하므로 +1
            json_body.code,
            json_body.type,
            json_body.cursorStart,
            json_body.cursorEnd
          );
          if(!users.includes(json_body.nickname)) setUsers([...users, json_body.nickname]);

          // Update other user cursor position
          // setOtherUserCursors((prevCursors) => {
          //   const existingCursorIndex = prevCursors.findIndex(
          //     (cursor) => cursor.nickname === json_body.nickname
          //   );
          //   if (existingCursorIndex > -1) {
          //     // Update existing cursor position
          //     const updatedCursors = [...prevCursors];
          //     updatedCursors[existingCursorIndex] = {
          //       ...updatedCursors[existingCursorIndex],
          //       position: new monaco_editor.Position(
          //         json_body.cursorLine,
          //         json_body.cursorColumn
          //       ),
          //     };
          //     return updatedCursors;
          //   } else {
          //     // Add new cursor
          //     return [
          //       ...prevCursors,
          //       {
          //         nickname: json_body.nickname,
          //         position: new monaco_editor.Position(
          //           json_body.cursorLine,
          //           json_body.cursorColumn
          //         ),
          //       },
          //     ];
          //   }
          // });
        }
      }
    );
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  // 다른 사용자의 커서 위치 변경
  useEffect(() => {
    if (editorRef.current && otherUserCursors.length > 0) {
      const decorations = otherUserCursors.map((cursor) => ({
        range: new monaco_editor.Range(
          cursor.position.lineNumber,
          cursor.position.column,
          cursor.position.lineNumber,
          cursor.position.column
        ),
        options: {
          className: "other-user-cursor",
          glyphMarginClassName: "other-user-cursor-margin",
          hoverMessage: { value: cursor.nickname },
          isWholeLine: false,
        },
      }));

      editorRef.current.deltaDecorations([], decorations);
    }
  }, [otherUserCursors]);

  const splitString = (text) => {
    console.log("복사해줄게 ㅋㅋ");
    // return text.split('\n');
  }

  function setLineContent(lineNumber, newText, type, cursorStart, cursorEnd) {
    const model = editorRef.current.getModel();

    if (!model) {
      console.error("모델이 없습니다.");
      return;
    }

    const currentLine = lineNumber + 1; // 프론트 원래 라인
    const startColumn = cursorStart;
    const endColumn = cursorEnd;
    let edit = {};

    // if (newText === lineContent) {
    //   return;
    // }

    isApplyingEdits.current = true; // Set the flag before making edits

    if (type === "delete") {
      if (lineNumber > 1) {
        const prevLineContent = model.getLineContent(lineNumber); // 이전 라인의 내용
        const lineValue = model.getLineContent(currentLine); // 현재 라인의 내용
        edit =
        {
          range: new monaco_editor.Range(
            lineNumber,
            1,
            lineNumber + 1,
            lineValue.length + 1
          ),
          text: newText[0],
          forceMoveMarkers: false,
        };
      }
    } else if (type === "create") {
      console.log(lineNumber, ": ");
      console.log("value: ", newText);
      const prevLineContent = model.getLineContent(lineNumber); // 이전 라인의 내용
      let text;
      const lineContent = model.getLineContent(currentLine); // 현재
      // 중간 엔터
      if (newText.length >= 3) {
        text = newText[0] + "\n" + newText[1] + "\n" + newText[2] + "\n";
        edit = {
          range: new monaco_editor.Range(
            lineNumber,
            1,
            lineNumber + 1,
            1
          ),
          text: text,
          forceMoveMarkers: false,
        };

      } else {
        console.log("enter");
        text = newText[0] + "\n" + newText[1];

        // Create two edits: one for the line split and one for the remaining text
        // edit = [
        edit = {
          range: new monaco_editor.Range(
            lineNumber,
            1,
            lineNumber,
            prevLineContent.length + 1
          ),
          text: text,
          forceMoveMarkers: false,
        };
      }
    } else {
      // 기본적인 텍스트 업데이트
      const lineContent = model.getLineContent(currentLine);
      edit = {
        range: new monaco_editor.Range(
          currentLine,
          1,
          currentLine,
          lineContent.length + 1
        ),
        text: newText[0],
        forceMoveMarkers: false,
      };
    }
    console.log("edit: ", edit);
    // 모델에 편집 내용을 적용
    if (Array.isArray(edit)) {
      model.applyEdits(edit);
    } else {
      model.applyEdits([edit]);
    }

    isApplyingEdits.current = false; // Reset the flag after making edits
  }

  const findBracket = (code, line) => {
    let bracketStack = [];

    // 주어진 줄까지의 코드를 가져옵니다.
    const codeUntilLine = code.split('\n').slice(0, line).join('\n');

    // 코드의 처음부터 해당 줄까지의 문자열을 순회합니다.
    for (let i = 0; i < codeUntilLine.length; i++) {
      const char = codeUntilLine[i];

      if (char === '{' || char === '[' || char === '(') {
        bracketStack.push(char);
      } else if (char === '}' || char === ']' || char === ')') {
        const lastBracket = bracketStack.pop();
        if (
          (char === '}' && lastBracket !== '{') ||
          (char === ']' && lastBracket !== '[') ||
          (char === ')' && lastBracket !== '(')
        ) {
          // 불일치하는 괄호 발견
          return false;
        }
      }
    }

    // 모든 열린 괄호가 닫혔는지 확인합니다.
    return bracketStack.length === 0;
  };


  const handleEditorChange = (value, e) => {
    if (isApplyingEdits.current) return;

    const currentLine = editorRef.current.getPosition().lineNumber;
    console.log("복붙해봐: ", e.changes[0].text, " 시작 위치: ", e.changes[0].range.startLineNumber, " 변경 끝난 위치: ", currentLine);
    // bracket = e.changes[0].text === "{" || 
    // 라인 삭제 확인

    const deletedLines = e.changes
      .filter(
        (change) =>
          change.text === "" &&
          change.range.startLineNumber !== change.range.endLineNumber
      )
      .flatMap((change) => {
        const lines = [];
        for (
          let i = change.range.startLineNumber;
          i <= change.range.endLineNumber;
          i++
        ) {
          lines.push(i);
        }
        return lines;
      });
    // const codeList = e.changes[0].text.split("\n");
    // paste
    // if (codeList.length > 2 && codeList[0].includes("\r")) {
    //   console.log(codeList);
    //   publish(
    //     codeList,
    //     currentLine - 1,
    //     "paste",
    //     e.changes[0].range.startColumn,
    //     e.changes[0].range.endColumn
    //   );
    // }
    // 엔터
    if (e.changes[0].text.includes("\n")) {
      let lineString = [];
      const prevLine = editorRef.current
        .getModel()
        .getLineContent(currentLine - 1);
      const currentValue = editorRef.current.getModel().getLineContent(currentLine);

      lineString.push(prevLine, currentValue);
      console.log("엔터: ", lineString);
      // if (!findBracket(value, currentLine + 1)){
      //   lineString.push(editorRef.current.getModel().getLineContent(currentLine + 1));
      // }

      if (prevLine.includes("(") || prevLine.includes("{") || prevLine.includes("[")) {
        lineString.push(editorRef.current.getModel().getLineContent(currentLine + 1))
      }

      console.log("괄호 엔터: ", lineString);
      publish(
        lineString,
        currentLine - 1,
        "create",
        e.changes[0].range.startColumn,
        e.changes[0].range.endColumn
      );
    }

    // delete
    else if (deletedLines.length > 0) {
      // 삭제된 라인이 있음
      console.log("삭제된 라인:", deletedLines);
      const lineValue = editorRef.current
        .getModel()
        .getLineContent(currentLine);
      const lineString = [lineValue];
      publish(
        lineString,
        currentLine,
        "delete",
        e.changes[0].range.startColumn,
        e.changes[0].range.endColumn
      );
    }

    // update
    else {
      const lineValue = editorRef.current
        .getModel()
        .getLineContent(currentLine);

      const lineString = [lineValue];
      publish(
        lineString,
        currentLine - 1,
        "update",
        e.changes[0].range.startColumn,
        e.changes[0].range.endColumn
      );
    }
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
    comment === "" ? setActive(false) : setActive(true);
  };

  // 작업중인 파일 S3 업로드
  async function uploadToS3() {
    try {
      const res = await API.post(`/s3/upload`, {
        teamName: teamName,
        projectName: projectName,
        comment: comment,
      });
      console.log(res.data);
        setModalOpened(false);
    } catch (error) {
      console.error(error);
    }
  }

    // const addFile = async () => {
    //   try {
    //     const res = await API.post(``)
    //   }

    // }


  return (
    <>
      <Modal isOpen={modalOpened} setIsOpen={setModalOpened} addType={"Upload"} kr={"내용"} en={"comment"} value={comment} name={"comment"} active={active} onClick={uploadToS3} onChange={handleInputChange} />

      <Header
        teamName={teamName}
        projectName={projectName}
        fileName={selectedMenu}
        code={code}
                setModalOpened={setModalOpened}
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
          {users.length != 0 && (
          <Participants participants={users} isCollapsed={isCollapsed} />)}
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
            onPaste={splitString}
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
