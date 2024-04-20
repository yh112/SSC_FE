import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInput from "./Components/UserInput";
import UserButton from "./Components/UserButton";
import API from "./BaseUrl";

function Login() {
  const [userInfo, setUserInfo] = useState({
    userId: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(true);
  const [active, setActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
    setActive(userInfo.userId !== "" && userInfo.password !== "");
  };

  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    console.log(userInfo);
    API.get("/login/login", {
      userId: String(userInfo.userId),
      password: String(userInfo.password),
    })
      .then((response) => {
        console.log(response.data);
        if (response.data === "success") {
          console.log("로그인 성공");
          navigate("/connect");
        } else {
          setLoginError(true);
          console.log("로그인 실패");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="mainFrameCol">
      <div className="userFrame" onChange={handleInputChange}>
        {loginError === true && (
          <div className="loginError">
            <img src="./loginError.png"/>
            <span>아이디 또는 비밀번호가 일치하지 않습니다.</span>
          </div>
        )}
        <div className="loginText">
          <span className="textKr">아이디</span>
          <span className="textEn">ID</span>
          <UserInput
            type="text"
            value={userInfo.userId}
            error={loginError}
            name="userId"
          />
        </div>
        <div className="loginText">
          <span className="textKr">비밀번호</span>
          <span className="textEn">P/W</span>
          <UserInput
            type="password"
            value={userInfo.password}
            error={loginError}
            name="password"
          />
        </div>
      </div>
      <div className="btnWrapper">
        <UserButton
          text="로그인"
          onClick={handleLogin}
          active={active}
          disabled={userInfo.userId === "" && userInfo.password === ""}
        />
        <button className="userButton" onClick={handleSignUp}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
