import React from "react";
import { useNavigate } from "react-router-dom";
import { GoUpload, GoX, GoPersonAdd } from "react-icons/go";
import { VscDebugStart } from "react-icons/vsc";
import API from "../BaseUrl";

function Header({ teamName, projectName, fileName, code, setModalOpened }) {

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
  const navigate = useNavigate();

  return (
    <div className="header">
      <div>
        {fileName}
      </div>
      <div className="buttons">
      <VscDebugStart onClick={() => compileCode()} />
      <GoUpload onClick={() => setModalOpened(true)} />
      <GoPersonAdd />
      <GoX onClick={() => navigate(-1) }/>
      </div>
    </div>
  );
}

export default Header;
