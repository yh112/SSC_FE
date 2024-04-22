import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "./Components/BackButton";
import API from "./BaseUrl";

const Connect = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [active, setActive] = useState(false);

  const connecting = () => {
    async function fetchChatRoom() {
      try {
        const res = await API.get("/editor/connect");

        console.log(res.data);
        navigate(`/editor/${res.data}`);
      } catch (error) {
        console.error(error);
      }
    }
    console.log("click");
    fetchChatRoom();
  };
  const inputRoomId = (e) => {
    setRoomId(e.target.value);
    setActive(roomId !== "");
  };

  const join = () => {
    console.log(roomId);
    //TODO: 코드가 유효한지 확인 과정 필요
    navigate(`/editor/${roomId}`);
  };

  return (
    <div className="mainFrameCol">
      <div className="userFrame">
        <BackButton />
        <div className="loginText">
          <span className="textKr">코드</span>
          <span className="textEn">Code</span>
          <input className="userInput" onChange={inputRoomId} type="text" />
        </div>
        <div className="btnWrapper">
          <button
            className={active ? "activeUserButton" : "inactiveUserButton"}
            disabled={roomId === ""}
            onClick={join}
          >
            입장
          </button>
          <button className="userButton" onClick={() => connecting()}>
            쉐어링 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default Connect;
