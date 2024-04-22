import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();
  const handleBackBtn = () => {
    navigate(-1);
  };
  return (
    <div className="backBtn">
      <p onClick={handleBackBtn}>&larr;</p>
    </div>
  );
}

export default BackButton;
