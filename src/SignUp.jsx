import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./Components/BackButton";
import UserButton from "./Components/UserButton";
import InputText from "./Components/InputText";
import API from "./BaseUrl";

function SignUp() {
  const [active, setActive] = useState(false);
  const [userInfo, setUserInfo] = useState({
    userId: "",
    password: "",
    nickname: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
    setActive(
      userInfo.userId !== "" &&
        userInfo.password !== "" &&
        userInfo.nickname !== ""
    );
    console.log(userInfo);
  };

  const navigate = useNavigate();
  const handleSignUp = () => {
    API.post("/user/register", {
      userId: String(userInfo.userId),
      password: String(userInfo.password),
      nickname: String(userInfo.nickname),
    }).then((response) => {
      console.log(response.data);
      if (response.data === "success") {
        console.log("회원가입 성공");
        navigate("/login");
      } else {
        console.log("회원가입 실패");
      }
    });
  };

  return (
    <div className="mainFrameCol">
      <div className="userFrame" onChange={handleInputChange}>
        <BackButton />
        <InputText kr="아이디" en="ID" type="text" value={userInfo.userId} name="userId" error={false} />
        <InputText kr="비밀번호" en="P/W" type="password" value={userInfo.password} name="password" error={false} />
        <InputText kr="닉네임" en="Nick n" type="text" value={userInfo.nickname} name="nickname" error={false} />
      </div>
      <div className="btnWrapper">
        <UserButton
          text="회원가입"
          onClick={handleSignUp}
          active={active}
          disabled={
            userInfo.userId === "" &&
            userInfo.password === "" &&
            userInfo.nickname === ""
          }
        />
      </div>
    </div>
  );
}

export default SignUp;
