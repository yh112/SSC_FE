import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInput from "./Components/UserInput";
import BackButton from "./Components/BackButton";
import axios from "axios";
import API from "./BaseUrl";

function SignUp() {
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
  };

  const navigate = useNavigate();
  const handleSignUp = () => {
    API
    .post("/login/register", {
      userId: String(userInfo.userId),
      password: String(userInfo.password),
      nickname: String(userInfo.nickname),
    })
    .then((response) => {
      console.log(response.data);
      if(response.data === "success") {
        console.log("회원가입 성공");
        navigate("/login");
      } else {
        console.log("회원가입 실패");
      }
    })
  };

  return (
    <div className="signup">
      <BackButton />
      <div className="userFrame" onChange={handleInputChange}>
        <UserInput type="text" value={userInfo.id} name="id" />
        <UserInput type="password" value={userInfo.password} name="password" />
        <UserInput type="text" value={userInfo.nickname} name="nickname" />
      </div>
      <button className="actionBtn" onClick={handleSignUp}>
        회원가입
      </button>
    </div>
  );
}

export default SignUp;
