import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./BaseUrl";
import axios from "axios";

const Connect = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState("");

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
          console.log("click")
          fetchChatRoom();
    }
    const inputRoomId = (e) => {
      setRoomId(e.target.value);
    }

    const join = () => {
      console.log(roomId);
      //TODO: 코드가 유효한지 확인 과정 필요
      navigate(`/editor/${roomId}`);
    };
    
    return (
        <div>
            <button onClick={() => connecting()}>쉐어링 시작</button>
            <input onChange={inputRoomId} type="text" placeholder="code" />
            <button onClick={join}>입장</button>
        </div>
    )
}

export default Connect;