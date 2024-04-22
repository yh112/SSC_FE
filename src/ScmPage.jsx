import React, { useState } from "react";
import List from "./Components/List";
import Modal from "./Components/Modal";
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

  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [active, setActive] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");

  const handleInputChange = (e) => {
    const {value} = e.target;
    setTeamName(value);
    setActive(value !== "");
    console.log(teamName);
  };

  const handleProjectChange = (e) => {
    const {value} = e.target;
    setProjectName(value);
    setActive(value !== "");
    console.log(projectName);
  };

  const handleAdd = (type) => {
    return () => {
      if (type === 0) {
        //TODO: 서버에 추가
        setOpenTeamModal(false);
      } else {
        //todo: 서버에 추가
      }
    };
  };
  
  return (
    <>
      <Modal
        isOpen={openTeamModal}
        setIsOpen={setOpenTeamModal}
        addType="생성"
        kr="팀명"
        en="Team Name"
        value={teamName}
        name="teamName"
        active={active}
        onChange={handleInputChange}
      />
      <div className="mainFrameCol" style={{gap: '20px'}}>
        <div className="topFrameCenter">
        <button className="clickBtn" onClick={() => setOpenTeamModal(true)}>팀 생성</button>
        </div>
        <div className="scmPageFrame">
          <List listNames={teamNames}></List>
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
                <h4
                  className="vertical-timeline-element-subtitle"
                  style={{ opacity: "60%" }}
                >
                  {item.project}
                </h4>
                <p>#{item.message}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </>
  );
}

export default ScmPage;
