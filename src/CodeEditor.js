import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useEditorScroll from "./useEditorScroll";
import SockJS from "sockjs-client";
import axios from "axios";
import * as StompJs from "@stomp/stompjs";
import "./App.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const CodeEditor = () => {
  const { lineRef, textRef, preRef, handleScrollChange } = useEditorScroll();
  const [lineCount, setLineCount] = useState(0);

  const [highlightedHTML, setHighlightedCode] = useState("");
  const [code, setCode] = useState("");
  const [copyCode, setCopyCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [tapCount, setTapCount] = useState(0);
  const [start, setStart] = useState(0);

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

  const publish = () => {
    if (!client.current.connected) return;

    client.current.publish({
      destination: "/app/message",
      body: JSON.stringify({
        roomId: editorId,
        code: code,
        line: lineCount,
      }),
    });
  };

  const subscribe = () => {
    console.log("subscribe: " + client.current.connected);
    client.current.subscribe(`/subscribe/notice/${editorId}`, (body) => {
      const json_body = JSON.parse(body.body);
      console.log(json_body);
      setCopyCode(json_body.code);
    });
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

  useEffect(() => {
    setHighlightedCode(
      hljs.highlight(code, { language }).value.replace(/" "/g, "&nbsp; ")
    );
  }, [code, language]);

  useEffect(() => {
    textRef.current.setSelectionRange(start, start);
  }, [start]);

  const changeCode = (e) => {
    setCode(e.target.value);
  };

  const createMarkUpCode = (code) => ({
    __html: code,
  });

  const changeLanguage = (e) => {
    setLanguage(e.target.value);
  };

  const handleResizeHeight = useCallback(() => {
    textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);

  //   const handleKeyup = (e) => {
  //     if(e.key === "{") {
  //       setCode(
  //         code.substring(0, start) + "}" + code.substring(end, code.length)
  //       );
  //       console.log(code);
  //       e.target.selectionStart = e.target.selectionEnd = start;
  //     }
  //   }

  const handleKeydown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = code.substring(0, start) + "\t" + code.substring(end);
      textRef.value = value;
      setStart(start+1);
      setCode(value);
    } else if (e.key === "{") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = code.substring(0, start) + "{}" + code.substring(end);
      textRef.value = value;
      setStart(start + 1);
      setCode(value);
    }
  };
  // if(e.key === "Tab") {
  //   e.preventDefault();
  //   const start = textRef.selectionStart;
  //   const end = textRef.selectionEnd;
  //   const value = code.substring(0, start) + "  " + code.substring(end);
  //   textRef.value = value;
  //   setCode(
  //     code.substring(0, start) + "\t" + code.substring(end, code.length)
  //   );
  //   e.target.selectionStart = e.target.selectionEnd = start + 1;
  // }

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
              dangerouslySetInnerHTML={createMarkUpCode(highlightedHTML)}
            ></code>
          </pre>
        </div>
      </div>
      <div>
        <textarea className="text-viewer" value={copyCode} readOnly></textarea>
      </div>
    </div>
  );
};

export default CodeEditor;
