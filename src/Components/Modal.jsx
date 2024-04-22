import React from "react";
import UserButton from "./UserButton";
import InputText from "./InputText";
import CloseButton from "./CloseButton";

function Modal({isOpen, setIsOpen, addType, kr, en, value, name, active, onClick, onChange}) {

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal-wrap">
            <CloseButton setIsOpen={setIsOpen} />
            <div className="modal-content">
            <InputText kr={kr} en={en} type="text" value={value} name={name} error={false} onChange={onChange} />
            <UserButton
              text={addType}
              onClick={onClick}
              active={active}
              disabled={value === ""}
            />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
