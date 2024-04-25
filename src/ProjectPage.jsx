import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "./BaseUrl";
import List from "./Components/List";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";
import Folder from "./Components/Folder";
import { drawSelection } from "@uiw/react-codemirror";

//디렉토리 구조
//파일 누르면 코드 보여주기
function ProjectPage() {
  let { projectName } = useParams();
  let directory = [
    "front2/src/Component/BackButton.jsx",
    "front2/src/Component/CloseButton.jsx",
    "front2/src/Component/CommitList.jsx",
  ];
  const [code] = useState(`
    import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
    import software.amazon.awssdk.core.sync.RequestBody;
    import software.amazon.awssdk.core.waiters.WaiterResponse;
  `);

  const [folders, setFolders] = useState([]);
  // let folders = [];
  useEffect(() => {
    hljs.highlightAll();
  }, [code]);

  // useEffect(() => {
  //   for (let i = 0; i < directory.length; i++) {
  //     traverseFileTree(directory[i], "", null);
  //   }
  // }, []);

  useEffect(() => {
    const updatedFolders = [];

    // 폴더와 파일 구분
    for (const item of directory) {
      const parts = item.split("/");
      const itemName = parts.pop();
      const folderPath = parts.join("/") + "/";

      console.log(itemName, folderPath);

      const existingFolderIndex = updatedFolders.findIndex(folder => folder.folder === folderPath);
      if (existingFolderIndex !== -1) {
        updatedFolders[existingFolderIndex].files.push(itemName);
      } else {
        updatedFolders.push({ folder: folderPath, files: [itemName] });
      }

      console.log(updatedFolders);
    }
    setFolders(updatedFolders);
    console.log(folders);
  }, []);

  // const getDirectory = (directory, dirCnt, folderName, folders) => {
  //   if (dirCnt === 0) {
  //     console.log(folderName, directory);
  //     folders.push({ folder: folderName, file: directory });
  //     return;
  //   }
    
  //   const nextFolder = directory.slice(0, directory.indexOf("/"));
    
  //   if(folders.length === 0){
  //     folders.push({ folder: nextFolder });
  //   }else{
  //   for(let i = 0; i< folders.length; i++){
  //     if(folders[i].folder === nextFolder) 
  //     folders.folder[i]({ folder: nextFolder });
  //   }
  // };
  //   // folders.push({ folder: nextFolder });
  //   console.log(folders);
  //   getDirectory(directory.slice(directory.indexOf("/") + 1), dirCnt - 1, nextFolder, folders);
  // };

  // const traverseFileTree = async (item, path = "", formData) => {
  //   console.log(item);
  //   const parts = item.split("/"); // 주어진 경로를 '/'로 분할합니다.
  //   const itemName = parts.shift(); // 첫 번째 부분을 가져와서 현재 아이템 이름으로 사용합니다.
  
  //   if (parts.length === 0) {
  //     // 경로의 나머지 부분이 없으면 파일로 처리합니다.
  //     const file = new File([item], path, { type: "text/plain" });
  //     formData.append("files", file);
  //     return;
  //   }
  
  //   // 경로의 나머지 부분이 있으면 디렉토리로 처리합니다.
  //   const dirPath = path + itemName + "/";
  //   const directory = {
  //     isDirectory: true,
  //     name: itemName,
  //     createReader() {
  //       return {
  //         readEntries(callback) {
  //           callback(parts.map(part => ({ isFile: true, name: part })));
  //         }
  //       };
  //     }
  //   };
  
  //   await new Promise((resolve, reject) => {
  //     traverseFileTree(directory, dirPath, formData)
  //       .then(resolve)
  //       .catch(reject);
  //   });
  // };

  return (
    <>
      {/* <Folder folderName={folders.folder} fileNames={folders.file} /> */}
      <pre className="code-editor__present">
        <code>{code}</code>
      </pre>
    </>
  );
}


export default ProjectPage;
