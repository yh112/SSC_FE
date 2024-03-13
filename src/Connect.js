import React, { useCallback, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./BaseUrl";
import axios from "axios";

const Connect = () => {
    const navigate = useNavigate();

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
      
          fetchChatRoom();
    }
    
    return (
        <div>
            <button onClick={() => connecting()}>Connect</button>
        </div>
    )
}

export default Connect;