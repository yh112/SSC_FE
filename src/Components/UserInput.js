import React from "react";
import "../App.css"
const UserInput = ({ type, value, error, name, onChange}) => {
  return (
    <input
      className={error ? "loginErrorUserInput" : "userInput" }
      type={type}
      value={value}
      onChange={onChange}
      name={name}
    ></input>
  );
};

export default UserInput;