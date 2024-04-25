import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from './BaseUrl';
import List from "./Components/List";
import hljs from 'highlight.js';
import "highlight.js/styles/github.css";

//디렉토리 구조
//파일 누르면 코드 보여주기
function ProjectPage() {
  let { projectName } = useParams();

  const code = "import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;\nimport software.amazon.awssdk.core.sync.RequestBody;\nimport software.amazon.awssdk.core.waiters.WaiterResponse;"

  useEffect(() => {
    hljs.highlightAll();
  }, [code]);
  return (
    <>
        <pre className='code-editor__present'>
          <code>{code}</code>
          </pre>
    </>
  )
}

export default ProjectPage