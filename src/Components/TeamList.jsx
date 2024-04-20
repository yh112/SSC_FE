import React, { useState, useNavigate } from "react";

function TeamList({ teamNames }) {
  
  const navigateToTeam = (teamName) => {
    //TODO: 팀 페이지로 이동
  }

  return (
    <div className="teamList">
      {teamNames.slice(1).map((teamName, index) => (
        <div onClick={navigateToTeam(teamName)} className="team">
          <p key={index}>{teamName}</p>
        </div>
      ))}
    </div>
  );
}

export default TeamList;
