import React, { useCallback, useEffect, useState, useRef } from "react";
import useEditorScroll from "./useEditorScroll";
import "./App.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const CodeEditor = () => {
  const { lineRef, textRef, preRef, handleScrollChange } = useEditorScroll();
  const [lineCount, setLineCount] = useState(0);

  const [highlightedHTML, setHighlightedCode] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("java");
  const [tapCount, setTapCount] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    textRef.current?.focus();
  }, []);

  useEffect(() => {
    setLineCount(code.split("\n").length);
  }, [code]);

  useEffect(() => {
    setHighlightedCode(
      hljs.highlight(code, { language }).value.replace(/" "/g, "&nbsp; ")
    );
  }, [code, language]);

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

  const handleKeyup = (e) => {
    if(e.key === "{") {
      setStart(e.target.selectionStart);
      setEnd(e.target.selectionEnd);
      setCode(
        code.substring(0, start) + "}" + code.substring(end, code.length)
      );
      console.log(code);
      e.target.selectionStart = e.target.selectionEnd = start;
    }
  }

  const handleKeydown = (e) => { {
    {
      {
        {
          {
            {
              {                            
              }
            }
          }
        }
      }
    }
  }
    if(e.key === "Tab") {
      e.preventDefault();
      setStart(e.target.selectionStart);
      setEnd(e.target.selectionEnd);
      console.log(start, end);
      setCode(
        code.substring(0, start) + "\t" + code.substring(end, code.length)
      );
      e.target.selectionStart = e.target.selectionEnd = start + 1;
    }
  }

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
            onKeyUp={handleKeyup}
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
    </div>
  );
};

export default CodeEditor;
