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
      if (!users.includes(res.data)) {
        setUsers([...users, res.data]); 
      }
      console.log(users);
      console.log(res.data);
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
        projectName: projectName,
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

  const createFile = async (fileName) => {
    try {
      const res = await API.post(`/snapshot/create`, {
        roomId: teamName,
        projectName: projectName,
        fileName: fileName,
      });
      console.log(fileName);
      getSnapshotList();
    } catch (error) {
      console.error(error);
    }
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
    console.log("connect");
    client.current = new StompJs.Client({
      brokerURL: process.env.REACT_APP_BROKERURL,
      onConnect: () => {
        subscribe();
      },
    });

    client.current.webSocketFactory = function () {
      return new SockJS(process.env.REACT_APP_SOCKJSURL);
    };

    client.current.activate();
  };

  const publish = (inputCode, currentLine, type, cursorStart, cursorEnd) => {
    if (!client.current.connected) return;
    console.log("pub: ", currentLine, type);

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
        if (json_body.nickname != nickname) {
          console.log(json_body);
          setLineContent(
            json_body.line, // 프론트에선 1부터 시작하므로 +1
            json_body.code,
            json_body.type,
            json_body.cursorStart,
            json_body.cursorEnd
          );
          if (!users.includes(json_body.nickname)) {
            setUsers([...users, json_body.nickname]);
          }

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
  // useEffect(() => {
  //   if (editorRef.current && otherUserCursors.length > 0) {
  //     const decorations = otherUserCursors.map((cursor) => ({
  //       range: new monaco_editor.Range(
  //         cursor.position.lineNumber,
  //         cursor.position.column,
  //         cursor.position.lineNumber,
  //         cursor.position.column
  //       ),
  //       options: {
  //         className: "other-user-cursor",
  //         glyphMarginClassName: "other-user-cursor-margin",
  //         hoverMessage: { value: cursor.nickname },
  //         isWholeLine: false,
  //       },
  //     }));

  //     editorRef.current.deltaDecorations([], decorations);
  //   }
  // }, [otherUserCursors]);

  const splitString = (text) => {
    console.log("복사해줄게 ㅋㅋ");
    // return text.split('\n');
  };

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
        edit = {
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
      console.log("value: ", newText);
      console.log("lineCount:", model.getLineCount());
      const prevLineContent = model.getLineContent(lineNumber); // 이전 라인의 내용
      let text;

      if (model.getLineCount() < currentLine && newText.length < 3) {
        // 마지막 라인에 추가
        console.log("마지막 라인에 추가");
        text = newText[0] + "\n";
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
      } else {
        if (newText.length == 3) {
          const lineValue = model.getLineContent(currentLine);
          console.log("괄호: ", prevLineContent, lineValue);

          text = newText[0] + "\n" + newText[1] + "\n" + newText[2];
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
        // else if (newText.length == 2) {
        //   const lineValue = model.getLineContent(currentLine);
        //   console.log("중간 엔터: ", lineValue);

        //   text = newText[0] + "\n" + newText[1] + "\n";
        //   edit = {
        //     range: new monaco_editor.Range(
        //       lineNumber,
        //       1,
        //       lineNumber,
        //       prevLineContent.length + 1
        //     ),
        //     text: text,
        //     forceMoveMarkers: false,
        //   };
        // }
        else {
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
      }
    } else {
      // 기본적인 텍스트 업데이트
      console.log("업데이트");
      const lineValue = model.getLineContent(currentLine);
      edit = {
        range: new monaco_editor.Range(
          currentLine,
          1,
          currentLine,
          lineValue.length + 1
        ),
        text: newText[0],
        forceMoveMarkers: false,
      };
    }
    console.log("edit: ", edit);
    model.applyEdits([edit]);
    isApplyingEdits.current = false; // Reset the flag after making edits
  }

  function checkAdjacentParentheses(text, lineNumber, cursorColumn) {
    // 텍스트를 라인별로 분리
    const lines = text.split("\n");

    // 현재 라인의 텍스트 가져오기
    const currentLine = lines[lineNumber - 1];

    // 다음 두 줄이 있는지 확인
    if (lines.length <= lineNumber) {
      return false; // 다음 줄이 없으면 false 반환
    }
    const lineAfterNext = lines[lineNumber + 1]; // 다다음 줄

    // 커서 바로 앞 문자 가져오기
    const beforeCursor = currentLine[cursorColumn - 2]; // 커서 바로 앞 문자

    // 다다음 줄 첫 번째 문자 가져오기
    const lastCharAfterNextLine = lineAfterNext
      ? lineAfterNext[lineAfterNext.length - 1]
      : "";
    console.log(
      "라인: ",
      lines,
      "커서: ",
      cursorColumn,
      "라인: ",
      lineNumber,
      "커서 앞: ",
      beforeCursor,
      "다다음 줄: ",
      lineAfterNext,
      "다다음 줄 첫 문자: ",
      lastCharAfterNextLine
    );

    // 괄호 확인
    if (
      (beforeCursor === "(" && lastCharAfterNextLine === ")") ||
      (beforeCursor === "[" && lastCharAfterNextLine === "]") ||
      (beforeCursor === "{" && lastCharAfterNextLine === "}")
    ) {
      return true; // 커서 앞과 다다음 줄 첫 문자에 괄호가 있는 경우
    } else {
      return false; // 그렇지 않은 경우
    }
  }

  const handleEditorChange = (value, e) => {
    if (isApplyingEdits.current) return;

    const currentLine = editorRef.current.getPosition().lineNumber;
    console.log(
      "복붙해봐: ",
      e.changes[0].text,
      " 시작 위치: ",
      e.changes[0].range.startLineNumber,
      " 변경 끝난 위치: ",
      currentLine
    );

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
      const currentValue = editorRef.current
        .getModel()
        .getLineContent(currentLine);

      lineString.push(prevLine, currentValue);
      if (
        checkAdjacentParentheses(
          value,
          currentLine - 1,
          e.changes[0].range.startColumn
        )
      ) {
        console.log("괄호가 있음");
        lineString.push(
          editorRef.current.getModel().getLineContent(currentLine + 1)
        );
      }

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
      <Modal
        isOpen={modalOpened}
        setIsOpen={setModalOpened}
        addType={"Upload"}
        kr={"내용"}
        en={"comment"}
        value={comment}
        name={"comment"}
        active={active}
        onClick={uploadToS3}
        onChange={handleInputChange}
      />

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
            <Participants participants={users} isCollapsed={isCollapsed} />
          )}
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
