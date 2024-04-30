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
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [users, setUsers] = useState(["이현", "준형", "규민"]);
  const [paths, setPaths] = useState([
    // "front2/src/Component/BackButton.jsx",
    // "front2/src/Component/CloseButton.jsx",
    // "front2/src/Component/CommitList.jsx",
    // "front2/public/index.html",
    // "front2/RAEDME.md",
    // "front2/public/favicon.ico",
  ]);
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [selectedMenu, setSelectedMenu] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
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
      console.error(error)
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
        fileName: fileName
      }),
    });
  };

  const subscribe = (fileName) => {
    console.log("subscribe: " + client.current.connected);
    console.log(teamName);

    client.current.subscribe(`/subscribe/notice/${teamName}/${fileName}`, (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      changeCode(json_body.code, false);
      //setUsers(json_body.userList);
    });
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

  useEffect(() => {
    setLineCount(code.split("\n").length);
    // publish();
  }, [code]);

  const findBracket = () => {
    console.log(code);
    leftBracketPosition = [];
    rightBracketPosition = [];
    const rightExp = /\}/g;
    const leftExp = /\{/g;
    let leftPos, rightPos;
    while (
      (leftPos = leftExp.exec(code)) !== null &&
      (rightPos = rightExp.exec(code)) !== null
    ) {
      console.log(leftPos.index);
      console.log(rightPos.index);
      leftBracketPosition.push(leftPos.index);
      rightBracketPosition.push(rightPos.index);
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

  const handleKeydown = (e) => {
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    let value;
    //updateCode(e.key);
    setStart(start);
    setEnd(end);

    if (e.key === "Tab") {
      e.preventDefault();
      value = code.substring(0, start) + "\t" + code.substring(end);
      textRef.value = value;
      setStart(start + 1);
      setEnd(end + 1);
      changeCode(value, true);
    } else if (e.key === "{") {
      e.preventDefault();
      value = code.substring(0, start) + "{}" + code.substring(end);
      setStart(start + 1);
      changeCode(value, true);
      setEnd(end + 1);
    } else if (e.key === "(") {
      e.preventDefault();
      value = code.substring(0, start) + "()" + code.substring(end);
      textRef.value = value;
      setStart(start + 1);
      setEnd(end + 1);
      changeCode(value, true);
    } else if (e.key === "[") {
      e.preventDefault();
      value = code.substring(0, start) + "[]" + code.substring(end);
      textRef.value = value;
      setStart(start + 1);
      setEnd(end + 1);
      changeCode(value, true);
    } else if (e.key === "'") {
      e.preventDefault();
      value = code.substring(0, start) + "''" + code.substring(end);
      textRef.value = value;
      setStart(start + 1);
      setEnd(end + 1);
      changeCode(value, true);
    } else if (e.key === '"') {
      e.preventDefault();
      value = code.substring(0, start) + '""' + code.substring(end);
      textRef.value = value;
      setStart(start + 1);
      setEnd(end + 1);
      changeCode(value, true);
    } else if (e.key === "Enter") {
      e.preventDefault();
      findBracket();
      if (leftBracketPosition.length > 0) {
        for (let i = 0; i < leftBracketPosition.length; i++) {
          if (start > leftBracketPosition[i]) {
            tabCount++;
          }
          if (start > rightBracketPosition[i]) {
            tabCount--;
          }
          if (start === Number(rightBracketPosition[i])) {
            enterCount++;
          }
        }
      }

      if (tabCount === 0) {
        //그냥 엔터
        value = code.substring(0, start) + "\n" + code.substring(start);
        textRef.value = value;
      } else if (tabCount > 0 && enterCount > 0) {
        //바로 뒤에 닫힌 대괄호가 있을 때
        value =
          code.substring(0, start) +
          "\n" +
          "\t".repeat(tabCount) +
          "\n" +
          "\t".repeat(tabCount - 1) +
          code.substring(start);
        textRef.value = value;
        changeCode(value, true);
      } else {
        //대괄호 있을 때
        value =
          code.substring(0, start) +
          "\n" +
          "\t".repeat(tabCount) +
          code.substring(start);
        textRef.value = value;
      }
      changeCode(value, true);
      setStart(start + tabCount + 1);
      setEnd(end + tabCount + 1);
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
        {fileList.length > 0 && (
          <Directory
            paths={fileList}
            getCode={getCode}
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
            <div className="code__lines" ref={lineRef}>
              {Array.from(Array(lineCount + 1).keys())
                .slice(1)
                .join("\n")}
            </div>

            <div>
              <textarea
                ref={textRef}
                onScroll={handleScrollChange}
                value={code}
                onChange={(e) => changeCode(e.target.value, true)}
                className="code-editor__textarea"
                rows={1}
                onKeyDown={(e) => handleKeydown(e)}
                onInput={handleResizeHeight}
                autoComplete="false"
                spellCheck="false"
              />
              <pre className="code-editor__present">
                <code
                  onInput={handleResizeHeight}
                  dangerouslySetInnerHTML={createMarkUpCode(highlightedHTML)}
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
