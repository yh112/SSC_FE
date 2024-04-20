import React, { useState } from "react";
import TeamList from "./Components/TeamList";
import ProjectList from "./Components/ProjectList";
import CommitList from "./Components/CommitList";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";

function ScmPage() {
  const teamNames = [
    "Team1",
    "Team2",
    "Team3",
    "Team4",
    "Team5",
    "Team6",
    "Team7",
    "Team8",
    "Team9",
    "Team10",
    "Team11",
    "Team12",
    "Team13",
    "Team14",
    "Team15",
    "Team16",
    "Team17",
    "Team18",
    "Team19",
    "Team20",
  ];
  const projectList = [
    "Project1",
    "Project2",
    "Project3",
    "Project4",
    "Project5",
  ];
  const [timelineData, setTimelineData] = useState([
    {
      date: "2021.09.01",
      message: "프로젝트 생성",
      team: "Team1",
      project: "프로젝트2",
    },
    {
      date: "2021.09.02",
      message: "최종 수정",
      team: "Team2",
      project: "프로젝트7",
    },
    {
      date: "2021.09.03",
      message: "백업",
      team: "Team3",
      project: "프로젝트1",
    },
  ]);

  return (
    <div className="mainFrameCol">
    <button>팀 생성</button>
    <button>프로젝트 생성</button>
      <div className="scmPageFrame">
      <TeamList teamNames={teamNames}></TeamList>
      {/* <ProjectList projectList={projectList}></ProjectList> */}
      <VerticalTimeline className="timeline">
        {timelineData.map((item, index) => (
          <VerticalTimelineElement
            key={index}
            date={item.date}
            dateClassName="dateClass"
            iconStyle={{ background: "#FF7A00", color: "#000" }}
            contentStyle={{ background: "#FF7A00", color: "#000" }}
            contentArrowStyle={{ borderRight: `7px solid #FF7A00` }}
            position="right"
          >
            <h3 className="vertical-timeline-element-title">{item.team}</h3>
            <h4 className="vertical-timeline-element-subtitle" style={{opacity: '60%'}}>
              {item.project}
            </h4>
            <p>#{item.message}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
      </div>
    </div>
  );
}

export default ScmPage;
