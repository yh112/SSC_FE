import React from "react";

const UserInput = ({ type, value, name, onChange}) => {
  return (
    <input
      className="userInput"
      type={type}
      value={value}
      onChange={onChange}
      name={name}
    ></input>
  );
};

export default UserInput;