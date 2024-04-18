import React, {useState} from "react";

function TeamList({ teamNames }) {
  const [isAdditionalListVisible, setIsAdditionalListVisible] = useState(false);

  const toggleAdditionalList = () => {
    setIsAdditionalListVisible(!isAdditionalListVisible);
  };
  return (
    <div>
      <div className="teamList">
        <p onClick={toggleAdditionalList}>{teamNames[0]}</p>
        {isAdditionalListVisible && teamNames.slice(1).map((teamName, index) => (
          <p key={index + 1}>{teamName}</p>
        ))}
      </div>
    </div>
  );
}

export default TeamList;