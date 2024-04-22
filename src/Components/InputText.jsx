import React from "react";
import UserInput from "./UserInput";

function InputText({kr, en, type, value, name, error, onChange}) {
  return (
    <div className="loginText">
      <span className="textKr">{kr}</span>
      <span className="textEn">{en}</span>
      <UserInput
        type={type}
        value={value}
        name={name}
        error={error}
        onChange={onChange}
      />
    </div>
  );
}

export default InputText;
