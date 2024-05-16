import React from "react";
import { GoUpload, GoX, GoPersonAdd } from "react-icons/go";
import { VscDebugStart } from "react-icons/vsc";
import API from "../BaseUrl";

function Header({ teamName, projectName, fileName, comment, code }) {
  // 작업중인 파일 S3 업로드
  async function uploadToS3() {
    try {
      const res = await API.post(`/s3/upload`, {
        teamName: teamName,
        projectName: projectName,
        comment: comment,
      });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function complileCode() {
    try {
      console.log(code);
      const res = await API.get(`/complie/runPython?code=` + code);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="header">
      {fileName}
      <VscDebugStart onClick={() => complileCode()} />
      <GoUpload onClick={() => uploadToS3()} />
      <GoPersonAdd />
      <GoX />
    </div>
  );
}

export default Header;
