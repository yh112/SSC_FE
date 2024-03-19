import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import useEditorScroll from "./useEditorScroll";
import SockJS from "sockjs-client";
// import axios from "axios";
import * as StompJs from "@stomp/stompjs";
import "./App.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const CodeEditor = () => {
  const { lineRef, textRef, handleScrollChange } = useEditorScroll();
  const [lineCount, setLineCount] = useState(0);
  const [highlightedHTML, setHighlightedCode] = useState("");
  const [code, setCode] = useState("");
  const [copyCode, setCopyCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [cursor, setCursor] = useState(0);
  let tabCount = 0;
  let leftBracketPosition = [];
  let rightBracketPosition = [];
  let enterCount = 0;

  const client = useRef();
  let { editorId } = useParams();

  /**
   * Socket
   */
  useEffect(() => {
    connect();

    return () => disconnect();
  }, []);

  const connect = () => {
    client.current = new StompJs.Client({
      brokerURL: "ws://43.201.78.73:8080/stomp",
      onConnect: () => {
        subscribe();
      },
    });

    client.current.webSocketFactory = function () {
      return new SockJS("http://43.201.78.73:8080/stomp");
    };

    client.current.activate();
  };

  //TODO: 실시간으로 데이터 주는 코드 추가
  const publish = () => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: "/app/message",
      body: JSON.stringify({
        roomId: editorId,
        code: code,
        start: cursor,
        line: lineCount,
      }),
    });
  };

  //TODO: 실시간으로 데이터 받는 코드 추가
  const subscribe = () => {
    console.log("subscribe: " + client.current.connected);
    client.current.subscribe(`/subscribe/notice/${editorId}`, (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      setCopyCode(json_body.code);
      //   addCode(json_body.code, json_body.start);
    });
  };

  const addCode = (text, start) => {
    const value = code.substring(0, start) + text + code.substring(start);
    setCode(value);
  };

  const disconnect = () => {
    client.current.deactivate();
  };

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  useEffect(() => {
    setLineCount(code.split("\n").length);
    publish();
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
    textRef.current.setSelectionRange(cursor, cursor);
  }, [cursor]);

  const changeCode = (e) => {
    setCode(e.target.value);
  };

  const createMarkUpCode = (code) => ({
    __html: code,
  });

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  //   const handleResizeHeight = useCallback(() => {
  //     textRef.current.style.height = textRef.current.scrollHeight + "px";
  //   }, []);

  const handleResizeHeight = () => {
    textRef.current.style.height = "auto";
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  };

  const handleKeydown = (e) => {
    // setCursor(e.target.selectionStart);
    console.log(e.target.selectionStart);
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = code.substring(0, start) + "\t" + code.substring(end);
      textRef.value = value;
      setCursor(start + 1);
      setCode(value);
    } else if (e.key === "{") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = code.substring(0, start) + "{}" + code.substring(end);
      textRef.value = value;
      setCursor(start + 1);
      setCode(value);
    } else if (e.key === "(") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = code.substring(0, start) + "()" + code.substring(end);
      textRef.value = value;
      setCursor(start + 1);
      setCode(value);
    } else if (e.key === "Enter") {
      e.preventDefault();
      findBracket();
      const start = e.target.selectionStart;
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
        console.log(
          "tab: " +
            tabCount +
            " enter: " +
            enterCount +
            " left: " +
            leftBracketPosition +
            " right: " +
            rightBracketPosition +
            " pos: " +
            start
        );
      }

      if (tabCount === 0) {
        //그냥 엔터
        const value = code.substring(0, start) + "\n" + code.substring(start);
        textRef.value = value;
        setCode(value);
      } else if (tabCount > 0 && enterCount > 0) {
        //바로 뒤에 닫힌 대괄호가 있을 때
        const value =
          code.substring(0, start) +
          "\n" +
          "\t".repeat(tabCount) +
          "\n" +
          "\t".repeat(tabCount - 1) +
          code.substring(start);
        textRef.value = value;
        setCode(value);
      } else {
        //대괄호 있을 때
        const value =
          code.substring(0, start) +
          "\n" +
          "\t".repeat(tabCount) +
          code.substring(start);
        textRef.value = value;
        setCode(value);
      }
      setCursor(start + tabCount + 1);
    }
  };

  return (
    <div>
      <select onChange={(e) => changeLanguage(e)}>
        <option value="java">Java</option>
        <option value="javascript">Javascript</option>
        <option value="python">Python</option>
        <option value="c">C</option>
        <option value="cpp">C++</option>
      </select>

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
            onChange={changeCode}
            className="code-editor__textarea"
            rows={1}
            onInput={handleResizeHeight}
            onKeyDown={handleKeydown}
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
      <div>
        <textarea className="text-viewer" value={copyCode}></textarea>
      </div>
    </div>
  );
};

export default CodeEditor;
