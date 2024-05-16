import React from "react";
import BackButton from "./BackButton";
import { GoDownload, GoX, GoPersonAdd } from "react-icons/go";
import { VscDebugStart } from "react-icons/vsc";
import API from "../BaseUrl";
import { useNavigate } from "react-router-dom";

function ProjectHeader({ teamName, projectName, fileName, code}) {
  // 작업중인 파일 S3 업로드

  async function complileCode() {
    try {
      console.log(code);
      const res = await API.get(`/complie/runPython?code=` + code);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }
  const navigate = useNavigate();
  const handleBackBtn = () => {
    navigate(-1);
  };

  return (
    <div className="header">
      {fileName}
      <VscDebugStart onClick={() => complileCode()} />
      <GoDownload />
      <GoX onClick={() => handleBackBtn()} />
    </div>
  );
}

export default ProjectHeader;