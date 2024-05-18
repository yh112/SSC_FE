import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  Fragment,
} from "react";
import AWS from "aws-sdk";
import API from "../BaseUrl";
import { GoChevronUp, GoChevronDown } from "react-icons/go";

const DragnDrop = ({ isOpened, setIsOpened, teamName, projectName, setFileList }) => {
  const [totalTag, setTotalTag] = useState();

  const traverseFileTree = async (item, path = "", formData) => {
    if (item.isFile) {
      // 파일인 경우 처리
      await new Promise((resolve, reject) => {
        item.file(function (file) {
          const fullPath = path + file.name;
          const chageFile = new File([file], fullPath, { type: file.type });
          formData.append("files", chageFile);
          resolve();
        }, reject);
      });
    } else if (item.isDirectory) {
      // 디렉토리인 경우 내부 탐색
      await new Promise((resolve, reject) => {
        const dirReader = item.createReader();

        dirReader.readEntries(async (entries) => {
          for (const entry of entries) {
            await traverseFileTree(entry, path + item.name + "/", formData);
          }

          resolve();
        }, reject);
      });
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event) => {
    event.preventDefault();

    let items = event.dataTransfer.items;
    const formData = new FormData();

    async function fetchFiles() {
      try {
        const res = await API.post(`/${teamName}/${projectName}/snapshots/save`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setFileList(res.data);
        setIsOpened(false);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    for (let i = 0; i < items.length; i++) {
      let item = items[i].webkitGetAsEntry();

      if (item) {
        await traverseFileTree(item, "", formData);
      }
    }

    fetchFiles();
  };

  return (
    <>
      <div className="topFrameRight">
        {isOpened ? (
          <GoChevronUp color="white" onClick={() => setIsOpened(!isOpened)} />
        ) : (
          <GoChevronDown color="white" onClick={() => setIsOpened(!isOpened)} />
        )}
      </div>
      {isOpened && (
        <div
          className="dropzone"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          Drop files here
        </div>
      )}
    </>
  );
};

export default DragnDrop;
