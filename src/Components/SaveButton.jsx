import React from "react";
import API from "../BaseUrl";

const save = () => {
  //TODO: 서버에 저장하는 로직 필요
  API.post("/anjffhgkwl", {});
};

function SaveButton({ onClick }) {
  return (
    <button className="miniButton" onClick={onClick}>
      Save
    </button>
  );
}

export default SaveButton;
