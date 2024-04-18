import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserInput from "./Components/UserInput";
import UserButton from "./Components/UserButton";
import API from "./BaseUrl";

function Login() {
  const [userInfo, setUserInfo] = useState({
    id: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    console.log(userInfo);
    API
      .get("/login/login", {
        userId: String(userInfo.id),
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
    <div className="login">
      <div className="loginError">
        { loginError === true && 
          <p>아이디 또는 비밀번호가 일치하지 않습니다.</p>}
      </div>
      <div className="userFrame" onChange={handleInputChange}>
        <UserInput type="text" value={userInfo.id} name="id" />
        <UserInput type="password" value={userInfo.password} name="password" />
      </div>
      <div className="btnWrapper">
        <UserButton
          text="로그인"
          onClick={handleLogin}
          disabled={userInfo.id === "" || userInfo.password === ""}
        />
        <button className="actionBtn" onClick={handleSignUp}>
          회원가입
        </button>
      </div>
    </div>
  );
}

export default Login;
