import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInput from "./Components/UserInput";
import BackButton from "./Components/BackButton";
import UserButton from "./Components/UserButton";
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
    API.post("/login/register", {
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
        <div className="loginText">
          <span className="textKr">아이디</span>
          <span className="textEn">ID</span>
          <UserInput type="text" value={userInfo.userId} name="userId" />
        </div>
        <div className="loginText">
          <span className="textKr">비밀번호</span>
          <span className="textEn">P/W</span>
          <UserInput
            type="password"
            value={userInfo.password}
            name="password"
          />
        </div>
        <div className="loginText">
          <span className="textKr">닉네임</span>
          <span className="textEn">Nick n</span>
          <UserInput type="text" value={userInfo.nickname} name="nickname" />
        </div>
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
