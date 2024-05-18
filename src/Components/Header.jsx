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

  const compileCode = async () => {
    try {
      // FormData 객체 생성
      const formData = new FormData();
      formData.append("code", code); // 'code'라는 필드에 code 변수의 값을 추가

      // console.log(code);

      // axios 요청 보내기
      const res = await API.post("/compile/runPython", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="header">
      {fileName}
      <VscDebugStart onClick={() => compileCode()} />
      <GoUpload onClick={() => uploadToS3()} />
      <GoPersonAdd />
      <GoX />
    </div>
  );
}

export default Header;
