import React from "react";

function CloseButton({ setIsOpen }) {
  console.log(setIsOpen);
  return (
    <div className="topFrameBetween">
      <div className="closeBtn" onClick={() => setIsOpen(false)}>
        X
      </div>
    </div>
  );
}

export default CloseButton;
