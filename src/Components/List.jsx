import React from "react";

function List({ className, elementClassName, listNames, onClick }) {
  return (
    <div className={className}>
      {listNames.slice(0).map((listElement, index) => (
        <div onClick={() => onClick(listElement)} className={elementClassName}>
          <p key={index}>{listElement}</p>
        </div>
      ))}
    </div>
  );
}

export default List;