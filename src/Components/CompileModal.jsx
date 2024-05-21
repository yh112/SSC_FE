import React from "react";
import CloseButton from "./CloseButton";

function CompileModal({ isOpen, setIsOpen, compileResult }) {
  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-wrap" style={{ display: "flex", gap: "20px", whiteSpace: "pre"}}>
            <CloseButton setIsOpen={setIsOpen} />
            <div className="modal-content" style={{ color: "white" }}>
              {compileResult}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompileModal;
