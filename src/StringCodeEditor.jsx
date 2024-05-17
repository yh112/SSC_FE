import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useEditorScroll from "./useEditorScroll";
import SockJS from "sockjs-client";
import * as StompJs from "@stomp/stompjs";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import DragnDrop from "./Components/DragnDrop";
import API from "./BaseUrl";
import Directory from "./Components/Directory";
import Participants from "./Components/Participants";
import SaveButton from "./Components/SaveButton";
import { useBeforeunload } from "react-beforeunload";
import Header from "./Components/Header";

const CodeEditor = () => {
  useBeforeunload((event) => event.preventDefault());

  const { lineRef, textRef, handleScrollChange } = useEditorScroll();
  const [lineCount, setLineCount] = useState(0);
  const [highlightedHTML, setHighlightedCode] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [cursorStart, setCursorStart] = useState(0);
  const [cursorEnd, setCursorEnd] = useState(0);
  const [users, setUsers] = useState(["이현", "준형", "규민"]);
  // const [paths, setPaths] = useState([
  //   "front2/src/Component/BackButton.jsx",
  //   "front2/src/Component/CloseButton.jsx",
  //   "front2/src/Component/CommitList.jsx",
  //   "front2/public/index.html",
  //   "front2/RAEDME.md",
  //   "front2/public/favicon.ico",
  // ]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
  const [lineIndex, setLineIndex] = useState([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [type, setType] = useState("update");
  const [cursor, setCursor] = useState(0);
  let leftBracketPosition = [];
  let rightBracketPosition = [];
  let enterCount = 0;
  let tabCount = 0;

  const client = useRef();
  let { editorId, teamName, commitId, projectName } = useParams();

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
      const res = await API.get(`/snapshot/${teamName}/${projectName}?fileName=` + fileName);

      setCode(res.data);
      setLineCount(res.data.split("\n").length);
      setFileName(fileName);
      subscribe(fileName);
    } catch (error) {
      console.error(error);
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

  // TODO: 카프카
  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "wss://server.sit-hub.com/stomp",
      onConnect: () => {
        subscribe();
      },
    });

    client.current.webSocketFactory = function () {
      return new SockJS("https://server.sit-hub.com/stomp");
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
    textRef.current.setSelectionRange(cursor, cursor);
    console.log("cursor: " + cursor);
  }, [cursor])

  const subscribe = (fileName) => {
    client.current.subscribe(
      `/subscribe/notice/${teamName}/${fileName}`,
      (body) => {
        const json_body = JSON.parse(body.body);

        setCursor(json_body.cursorStart);
        changeCode(json_body.code, false);
      }
    );
  };


  const disconnect = () => {
    client.current.deactivate();
  };

  // TODO: 카프카 끝
  
  useEffect(() => {
    textRef.current?.focus();
  }, []);

  // const addCode = (text, start) => {
  //   const value = code.substring(0, start) + text + code.substring(start);
  //   setCode(value);
  // };

  const findBracket = () => {
    leftBracketPosition = [];
    rightBracketPosition = [];
    const rightExp = /\}/g;
    const leftExp = /\{/g;
    let leftPos, rightPos;
    while (
      (leftPos = leftExp.exec(code)) !== null &&
      (rightPos = rightExp.exec(code)) !== null
    ) {
      leftBracketPosition.push(leftPos.index);
      rightBracketPosition.push(rightPos.index);
    }
  };

  // useEffect(() => {
  //   setHighlightedCode(
  //     hljs.highlight(code, { language }).value.replace(/" "/g, "&nbsp; ")
  //   );
  // }, [code, language]);

  // useEffect(() => {
  //   textRef.current.setSelectionRange(cursorStart, cursorEnd);
  // }, [cursorStart, cursorEnd]);

  const createMarkUpCode = (code) => ({
    __html: code,
  });

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleResizeHeight = () => {
    const textArea = textRef.current;

    const cursorPosition = textArea.selectionStart;
    const lineHeight = parseInt(getComputedStyle(textArea).lineHeight);
    const lines = lineCount;
    const scrollPosition = lineHeight * lines;

    textArea.scrollTop = scrollPosition - textArea.offsetHeight / 2

    console.log(scrollPosition + " / " + lineHeight);

    console.log("top: " + textArea.scrollTop);
  };

  const changeCode = (inputCode, myState) => {
    if (myState) {
      setCode(inputCode);
    } else {
      if (inputCode === code) return;
      setCode(inputCode);
    }
  };

  const updateCode = (key) => {
    API.post(`/code/${editorId}`, {
      code: key.target.value,
    }).then((response) => {
      console.log(response.data);
    });
  };

  // 서버에 업로드
  const saveFile = () => {
    // API.post(`/${teamName}/snapshots/save`).then((response) => {
    //   console.log(response.data);
    // });
  };

  // const findLineIndex = () => {
  //   let currentIndex = 0;
  //   let lineIndexes = [];
  //   let lineNumber = 0;

  //   while (currentIndex < code.length) {
  //     const newIndex = code.indexOf("\n", currentIndex);
  //     if (newIndex !== -1) {
  //       lineIndexes.push({
  //         line: lineNumber,
  //         lineStart: currentIndex,
  //         lineEnd: newIndex,
  //       });
  //       lineNumber++;
  //       currentIndex = newIndex + 1;
  //     } else {
  //       break;
  //     }
  //   }

  //   lineIndexes.push({
  //     line: lineNumber,
  //     lineStart: currentIndex,
  //     lineEnd: code.length,
  //   });

  //   setLineIndex(lineIndexes);
  // };

  // 수정 중인 라인 찾는 거
  // const findCurrentLine = () => {
  //   for (let i = 0; i < lineIndex.length; i++) {
  //     if (cursorStart >= lineIndex[i].lineStart && cursorStart <= lineIndex[i].lineEnd) {
  //       setCurrentLine(lineIndex[i].line);
  //       break;
  //     }
  //   }
  // };

  const searchCurrentLine = (e, start, end) => {
    // 키다운 이벤트 처리 -> 현재 커서 위치(start, end, linecount)
    // 체인지 이벤트 처리 -> 
    const startNum = code.lastIndexOf("\n", start);
    const endNum = code.indexOf("\n", end);

    console.log("startNum: " + startNum + " endNum: " + endNum);
  
    const lineStart = startNum < 0 ? 0 : startNum === endNum ? start : startNum + 1; // 현재 라인이 첫번째 라인일 때는 0, 커서 앞에 개행이 있으면 커서의 위치, 아니면 startNum + 1
    const lineEnd = endNum < 0 ? code.length - 1 : startNum === endNum ? end : endNum - 1; // 현재 라인이 마지막 라인일 때는 code.length - 1, 커서 뒤에 개행이 있으면 커서의 위치, 아니면 endNum - 1

    let lineNumber = 0;
    let index = 0;

    while (index <= start) {
      console.log("index: " + index + " start: " + start + " text: " + code[start] );
      index = code.indexOf('\n', index) + 1;
      lineNumber++;
    }

    console.log("start: " + start + " end: " + end + " line: " + lineNumber + " lineStart: " + lineStart + " lineEnd: " + lineEnd)

    setCursorStart(start);
    setCursorEnd(end);
    setCurrentLine(lineNumber - 1);
    setLineIndex({ start: lineStart, end: lineEnd });
  }

  const handleKeydown = (e) => {
    // const start = e.target.selectionStart;
    // const end = e.target.selectionEnd;
    const code = e.target.value;
    let value;
    //updateCode(e.key);

    if (e.key === "Tab") {
      e.preventDefault();
      value = code.substring(0, cursorStart) + "\t" + code.substring(cursorEnd);
      textRef.value = value;
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      changeCode(value, true);
    } else if (e.key === "Backspace") {
      console.log("cursor: " + cursorStart + " line: " + lineIndex.start);
      if (cursorStart < lineIndex.start && lineIndex.start !== 0) {
        setType("delete");
        console.log("delete");
        // publish();
      }
      setCursorStart((cursorStart) => cursorStart - 1);
      setCursorEnd((cursorEnd) => cursorEnd - 1);
    } else if (e.key === "{") {
      e.preventDefault();
      value = code.substring(0, cursorStart) + "{}" + code.substring(cursorEnd);
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      changeCode(value, true);
    } else if (e.key === "(") {
      e.preventDefault();
      value = code.substring(0, cursorStart) + "()" + code.substring(cursorEnd);
      textRef.value = value;
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      changeCode(value, true);
    } else if (e.key === "[") {
      e.preventDefault();
      value = code.substring(0, cursorStart) + "[]" + code.substring(cursorEnd);
      textRef.value = value;
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      changeCode(value, true);
    } else if (e.key === "'") {
      e.preventDefault();
      value = code.substring(0, cursorStart) + "''" + code.substring(cursorEnd);
      textRef.value = value;
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      changeCode(value, true);
    } else if (e.key === '"') {
      e.preventDefault();
      value = code.substring(0, cursorStart) + '""' + code.substring(cursorEnd);
      textRef.value = value;
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      changeCode(value, true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      setType("create");
      findBracket();
      // if (leftBracketPosition.length > 0) {
      //   for (let i = 0; i < leftBracketPosition.length; i++) {
      //     if (cursorStart > leftBracketPosition[i]) {
      //       tabCount++;
      //     }
      //     if (cursorStart > rightBracketPosition[i]) {
      //       tabCount--;
      //     }
      //     if (cursorStart === Number(rightBracketPosition[i])) {
      //       enterCount++;
      //     }
      //   }
      // }

      if (tabCount === 0) {
        //그냥 엔터
        value = code.substring(0, cursorStart) + "\n" + code.substring(cursorStart);
        textRef.value = value;
      } else if (tabCount > 0 && enterCount > 0) {
        //바로 뒤에 닫힌 대괄호가 있을 때
        value =
          code.substring(0, cursorStart) +
          "\n" +
          "\t".repeat(tabCount) +
          "\n" +
          "\t".repeat(tabCount - 1) +
          code.substring(cursorStart);
        textRef.value = value;
        changeCode(value, true);
      } else {
        //대괄호 있을 때
        value =
          code.substring(0, cursorStart) +
          "\n" +
          "\t".repeat(tabCount) +
          code.substring(cursorStart);
        textRef.value = value;
      }
      changeCode(value, true);
      setCursorStart((cursorStart) => cursorStart + tabCount + 1);
      setCursorEnd((cursorEnd) => cursorEnd + tabCount + 1);
    } else {
      console.log("그 외");
      setType("update");
      setCursorStart((cursorStart) => cursorStart + 1);
      setCursorEnd((cursorEnd) => cursorEnd + 1);
      // setCode(e.target.value);
    }
    console.log(type);
  };

  //TODO: type paste로 안 바뀜
  const pasteClipboard = (e) => {
    e.preventDefault();
    // console.log("paste");
    setType("paste");
    // console.log(type);
    let value = e.clipboardData.getData("text").split("\n");
    publish(value);
    changeCode(e.clipboardData.getData("text"), true);
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(editorId);
  };

  const shareCode = (e) => {
    const value = e.target.value.substring(
      lineIndex.start, lineIndex.end
    );

    publish(value);
  }

  return (
    <>
      <Header teamName={teamName} projectName={projectName} comment={"good"} />
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
          <div className="topFrameBetween">
            {selectedMenu}
            <select className="selectBox" onChange={(e) => changeLanguage(e)}>
              <option value="java">Java</option>
              <option value="javascript">Javascript</option>
              <option value="python">Python</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
          </div>
          {!code.length > 0 && (
            <DragnDrop
              isOpened={isOpened}
              setIsOpened={setIsOpened}
              teamName={teamName}
              setFileList={setFileList}
              projectName={projectName}
            />
          )}

          <div className="code-editor">
            <div className="code__lines" ref={lineRef}>
              {Array.from(Array(lineCount + 1).keys())
                .slice(1)
                .join("\n")}
            </div>

            <div>
              {/* <span style={{color: "white"}}>{fileName}</span> */}
              <textarea
                ref={textRef}
                onScroll={handleScrollChange}
                value={code}
                onChange={(e) => {
                  if (type !== "paste") {
                    searchCurrentLine(e, cursorStart, cursorEnd);
                    shareCode(e);
                  };
                }
                }
                className="code-editor__textarea"
                rows={lineCount}
                onKeyUp={(e) => handleKeydown(e)}
                onKeyDown={(e) => searchCurrentLine(e, e.target.selectionStart, e.target.selectionEnd)}
                onInput={handleResizeHeight}
                autoComplete="false"
                spellCheck="false"
                onPaste={pasteClipboard}
              />
              <pre className="code-editor__present">
                <code
                  onInput={handleResizeHeight}
                  dangerouslySetInnerHTML={createMarkUpCode(hljs.highlight(code, { language }).value.replace(/" "/g, "&nbsp; "))}
                ></code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
