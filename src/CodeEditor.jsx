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
  const [codeArray, setCodeArray] = useState([""]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [users, setUsers] = useState(["이현", "준형", "규민"]);
  const [paths, setPaths] = useState([
    "front2/src/Component/BackButton.jsx",
    "front2/src/Component/CloseButton.jsx",
    "front2/src/Component/CommitList.jsx",
    "front2/public/index.html",
    "front2/RAEDME.md",
    "front2/public/favicon.ico",
  ]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
  let currentString = "";
  let leftBracketPosition = [];
  let rightBracketPosition = [];
  let enterCount = 0;
  let tabCount = 0;

  const client = useRef();
  let { editorId, teamName, commitId } = useParams();

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
      const res = await API.get(`/snapshot/${teamName}?fileName=` + fileName);

      setCode(res.data);
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
        code: inputCode,
        line: lineCount,
        fileName: fileName,
      }),
    });
  };

  const subscribe = (fileName) => {
    console.log("subscribe: " + client.current.connected);
    console.log(teamName);

    client.current.subscribe(
      `/subscribe/notice/${teamName}/${fileName}`,
      (body) => {
        const json_body = JSON.parse(body.body);
        console.log(json_body);
        changeCode(json_body.code, false);
        //setUsers(json_body.userList);
      }
    );
  };

  // const addCode = (text, start) => {
  //   const value = code.substring(0, start) + text + code.substring(start);
  //   setCode(value);
  // };

  const disconnect = () => {
    client.current.deactivate();
  };

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  // useEffect(() => {
  //   setLineCount(code.split("\n").length);
  //   // publish();
  // }, [code]);

  // useEffect(() => {
  //   setLineCount(codeArray.split("\n").length);
  // }, [codeArray]);

  const findBracket = (lineCount) => {
    // console.log(code);
    leftBracketPosition = [];
    rightBracketPosition = [];
    const rightExp = /\}/g;
    const leftExp = /\{/g;
    let leftPos, rightPos;
    for (let i = 0; i < lineCount + 1; i++) {
      leftExp.lastIndex = 0;
      rightExp.lastIndex = 0;
      while (
        (leftPos = leftExp.exec(codeArray[i])) !== null &&
        (rightPos = rightExp.exec(codeArray[i])) !== null
      ) {
        console.log("line: " + i);
        leftBracketPosition.push({
          line: i,
          pos: leftPos.index,
        });
        rightBracketPosition.push({ line: i, pos: rightPos.index });
        leftExp.lastIndex = leftPos.index + 1;
        rightExp.lastIndex = rightPos.index + 1;
      }
    }
    console.log(leftBracketPosition, rightBracketPosition);
  };

  useEffect(() => {
    setHighlightedCode(
      hljs.highlight(code, { language }).value.replace(/" "/g, "&nbsp; ")
    );
  }, [code, language]);

  useEffect(() => {
    textRef.current.setSelectionRange(start, end);
  }, [start, end]);

  const createMarkUpCode = (code) => ({
    __html: code,
  });

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleResizeHeight = () => {
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  };

  const changeCode = (inputCode, myState) => {
    if (myState) {
      //console.log(inputCode);
      setCode(inputCode);
      publish(inputCode);
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

  const convertCode = () => {};

  // const handleKeydown = (e) => {
  //   const start = e.target.selectionStart;
  //   const end = e.target.selectionEnd;
  //   let value;
  //   //updateCode(e.key);
  //   setStart(start);
  //   setEnd(end);

  //   if (e.key === "Tab") {
  //   e.preventDefault();
  //     value = code.substring(0, start) + "\t" + code.substring(end);
  //     textRef.value = value;
  //     setStart(start + 1);
  //     setEnd(end + 1);
  //     changeCode(value, true);
  //   } else if (e.key === "{") {
  //   e.preventDefault();
  //     value = code.substring(0, start) + "{}" + code.substring(end);
  //     setStart(start + 1);
  //     changeCode(value, true);
  //     setEnd(end + 1);
  //   } else if (e.key === "(") {
  //   e.preventDefault();
  //     value = code.substring(0, start) + "()" + code.substring(end);
  //     textRef.value = value;
  //     setStart(start + 1);
  //     setEnd(end + 1);
  //     changeCode(value, true);
  //   } else if (e.key === "[") {
  //   e.preventDefault();
  //     value = code.substring(0, start) + "[]" + code.substring(end);
  //     textRef.value = value;
  //     setStart(start + 1);
  //     setEnd(end + 1);
  //     changeCode(value, true);
  //   } else if (e.key === "'") {
  //   e.preventDefault();
  //     value = code.substring(0, start) + "''" + code.substring(end);
  //     textRef.value = value;
  //     setStart(start + 1);
  //     setEnd(end + 1);
  //     changeCode(value, true);
  //   } else if (e.key === '"') {
  //   e.preventDefault();
  //     value = code.substring(0, start) + '""' + code.substring(end);
  //     textRef.value = value;
  //     setStart(start + 1);
  //     setEnd(end + 1);
  //     changeCode(value, true);
  //   } else if (e.key === "Enter") {
  //   e.preventDefault();
  //     // findBracket();
  //     // if (leftBracketPosition.length > 0) {
  //     //   for (let i = 0; i < leftBracketPosition.length; i++) {
  //     //     if (start > leftBracketPosition[i]) {
  //     //       tabCount++;
  //     //     }
  //     //     if (start > rightBracketPosition[i]) {
  //     //       tabCount--;
  //     //     }
  //     //     if (start === Number(rightBracketPosition[i])) {
  //     //       enterCount++;
  //     //     }
  //     //   }
  //     // }

  //     // if (tabCount === 0) {
  //     //   //그냥 엔터
  //     //   value = code.substring(0, start) + "\n" + code.substring(start);
  //     //   textRef.value = value;
  //     // } else if (tabCount > 0 && enterCount > 0) {
  //     //   //바로 뒤에 닫힌 대괄호가 있을 때
  //     //   value =
  //     //     code.substring(0, start) +
  //     //     "\n" +
  //     //     "\t".repeat(tabCount) +
  //     //     "\n" +
  //     //     "\t".repeat(tabCount - 1) +
  //     //     code.substring(start);
  //     //   textRef.value = value;
  //     //   changeCode(value, true);
  //     // } else {
  //     //   //대괄호 있을 때
  //     //   value =
  //     //     code.substring(0, start) +
  //     //     "\n" +
  //     //     "\t".repeat(tabCount) +
  //     //     code.substring(start);
  //     //   textRef.value = value;
  //     // }
  //     // changeCode(value, true);
  //     // setStart(start + tabCount + 1);
  //     // setEnd(end + tabCount + 1);
  //   }
  // };

  const handleKeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      // 엔터 키가 입력된 경우
      findBracket(lineCount);
      if (leftBracketPosition.length > 0) {
        for (let i = 0; i < leftBracketPosition.length; i++) {
          if (lineCount > leftBracketPosition[i].line) {
            tabCount++;
          }
          if (lineCount > rightBracketPosition[i].line) {
            tabCount--;
          }
          if (lineCount === Number(rightBracketPosition[i]).line) {
            enterCount++;
          }
        }
        console.log(tabCount, enterCount);
      }
      if(tabCount === 0) {
        setLineCount(lineCount + 1);
      setCodeArray((prevCodeArray) => {
        const updatedCodeArray = [...prevCodeArray];
        updatedCodeArray[lineCount + 1] = ""; //다음 줄 추가
        return updatedCodeArray;
      });
      } else if (tabCount > 0 && enterCount > 0) {
        setLineCount(lineCount + 1);
        setCodeArray((prevCodeArray) => {
          const updatedCodeArray = [...prevCodeArray];
          updatedCodeArray[lineCount + 1] = "\t".repeat(tabCount) + "\n" + "\t".repeat(tabCount - 1);
          return updatedCodeArray;
        });
      } else {
        setLineCount(lineCount + 1);
        setCodeArray((prevCodeArray) => {
          const updatedCodeArray = [...prevCodeArray];
          updatedCodeArray[lineCount + 1] = "\t".repeat(tabCount);
          return updatedCodeArray;
        });
      }

      setLineCount(lineCount + 1);
      setCodeArray((prevCodeArray) => {
        const updatedCodeArray = [...prevCodeArray];
        updatedCodeArray[lineCount + 1] = ""; //다음 줄 추가
        return updatedCodeArray;
      });
      console.log(codeArray);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      // 백스페이스 키가 입력된 경우
      setCodeArray((prevCodeArray) => {
        const updatedCodeArray = [...prevCodeArray];
        const currentLine = updatedCodeArray[lineCount] || "";
        updatedCodeArray[lineCount] = currentLine.slice(0, -1);
        return updatedCodeArray;
      });
    } else if (e.key === "Tab") {
      e.preventDefault();
      // 탭 키가 입력된 경우
      setCodeArray((prevCodeArray) => {
        const updatedCodeArray = [...prevCodeArray];
        const currentLine = updatedCodeArray[lineCount] || "";
        updatedCodeArray[lineCount] = currentLine + "  ";
        return updatedCodeArray;
      });
    } else if (e.key === "{") {
      e.preventDefault();
      setCodeArray((prevCodeArray) => {
        const updatedCodeArray = [...prevCodeArray];
        const currentLine = updatedCodeArray[lineCount] || "";
        updatedCodeArray[lineCount] = currentLine + "{}";
        return updatedCodeArray;
      });
    } else if (
      e.key === "Shift" ||
      e.key === "Control" ||
      e.key === "Alt" ||
      e.key === "Command" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "F12" ||
      e.key === "Meta"
    ) {
      e.preventDefault();
      // 특수 키가 입력된 경우
      return;
    } else {
      e.preventDefault();
      // 유효한 입력이 입력된 경우
      setCodeArray((prevCodeArray) => {
        // 기존 배열이 undefined인 경우
        console.log(prevCodeArray);
        const updatedCodeArray = [...prevCodeArray]; // 기존 배열 복사
        const currentLine = updatedCodeArray[lineCount] || ""; // 현재 라인 확인
        updatedCodeArray[lineCount] = currentLine + e.key; // 현재 라인에 새로운 키 추가
        return updatedCodeArray; // 업데이트된 배열 반환
      });
      console.log(codeArray);
    }
  };

  const copyClipboard = () => {
    navigator.clipboard.writeText(editorId);
  };

  return (
    <>
      <Header />
      <div className="mainFrameRow" style={{ gap: "0" }}>
        <div className="col">
          {paths.length > 0 && (
            <Directory
              // paths={fileList}
              paths={paths}
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

          <DragnDrop
            isOpened={isOpened}
            setIsOpened={setIsOpened}
            teamName={teamName}
            setFileList={setFileList}
          />

          <div className="code-editor">
            {/* <div className="code__lines" ref={lineRef}>
              {Array.from(Array(lineCount + 1).keys())
                .slice(1)
                .join("\n")}
            </div> */}

            <div>
              <textarea
                ref={textRef}
                onScroll={handleScrollChange}
                value={codeArray.join("\n")}
                onChange={(e) => changeCode(e.target.value, true)}
                className="code-editor__textarea"
                // rows={1}
                onKeyDown={(e) => handleKeydown(e)}
                onInput={handleResizeHeight}
                autoComplete="false"
                spellCheck="false"
              />
              {/* {codeArray.map((line, index) => (
                <input
                  type="text"
                  value={line}
                  ref={textRef}
                  onScroll={handleScrollChange}
                  onChange={(e) => changeCode(e.target.value, true)}
                  className="code-editor__textarea"
                  rows={1}
                  onKeyDown={(e) => handleKeydown(e, lineCount)}
                  // onInput={handleResizeHeight}
                >
                </input>
              ))} */}
              {/* <pre className="code-editor__present"> */}
              {/* <code
                  onInput={handleResizeHeight}
                  dangerouslySetInnerHTML={createMarkUpCode(highlightedHTML)}
                ></code> */}

              <code
                className="code-editor__present"
                onInput={handleResizeHeight}
              >
                {codeArray.slice(0).map((line, index) => (
                  <div>
                    {/* <span>{index}</span> */}
                    <span style={{ marginRight: "10px" }}>{index + 1}</span>
                    <span>{line}</span>
                  </div>
                ))}
              </code>
              {/* </pre> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeEditor;
