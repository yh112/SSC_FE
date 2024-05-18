import React from "react";
import Participants from "./Participants";
import TeamList from "./TeamList";
import Nickname from "./Nickname";

const Profile = ({
  teamName,
  teamList,
  nickname,
  participants,
  setTeamName,
}) => {
  return (
    <div>
      <div className="profile-nickname">{nickname}</div>
      <Nickname nickname={nickname} isCollapsed={false}></Nickname>
      <TeamList
        teamList={teamList}
        setTeamName={setTeamName}
        isCollapsed={false}
      ></TeamList>
      {teamName.length != 0 && (
        <Participants participants={participants} isCollapsed={false} />
      )}
    </div>
  );
};

export default Profile;
