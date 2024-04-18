import React from "react";
import TeamList from "./Components/TeamList";
import ProjectList from "./Components/ProjectList";
import CommitList from "./Components/CommitList";

function ScmPage() {
  const teamNames = ["Team1", "Team2", "Team3", "Team4", "Team5"];
  const projectList = [
    "Project1",
    "Project2",
    "Project3",
    "Project4",
    "Project5",
  ];
  const commitList = [
    "삭제버튼 추가",
    "수정버튼 추가",
    "추가버튼 추가",
    "리스트 추가",
  ];
  return (
    <div>
      <TeamList teamNames={teamNames}></TeamList>
      <ProjectList projectList={projectList}></ProjectList>
      <CommitList commitList={commitList}></CommitList>
    </div>
  );
}

export default ScmPage;
