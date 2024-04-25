import React from "react";

function List({ listNames, onClick }) {
  return (
    <div className="list">
      {listNames.slice(0).map((listElement, index) => (
        <div onClick={() => onClick(listElement)} className="listElement">
          <p key={index}>{listElement}</p>
        </div>
      ))}
    </div>
  );
}

export default List;
