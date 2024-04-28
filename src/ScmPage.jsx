import React, { useEffect, useState } from "react";
import List from "./Components/List";
import Modal from "./Components/Modal";
import API from "./BaseUrl";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import moment from "moment";
import "moment/locale/ko";

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
  const [newTeamName, setNewTeamName] = useState("");

  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [teamList, setTeamList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [commitList, setCommitList] = useState([]);

  useEffect(() => {
    getTeamList();
  },[])

  // 팀 목록 조회
  async function getTeamList() {
    try {
      const res = await API.get(`/team/list`)

      setTeamList(res.data);
      setCommitList([]);
      setUserList([]);
    } catch (error) {
      console.error(error)
    }
  }

  // 팀원 조회
  async function getUsers(teamName) {
    try {
      const res = await API.get(`/team/${teamName}/users`)

      setUserList(res.data);
    } catch (error) {
      console.error(error)
    }
  }

  // 팀의 프로젝트 목록 조회
  async function getProjectList(teamName) {
    try {
      const res = await API.get(`/team/${teamName}/projects`)
    
      setProjectList(res.data);
      setTeamName(teamName);
      getUsers(teamName);
      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  }

  // 프로젝트 커밋내역 조회
  async function getCommitList(projectName) {
    try {
      const res = await API.get(`/manage/list/${teamName}/${projectName}`);

      setCommitList(res.data);
      setProjectName(projectName);

      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  }

  // 새로운 프로젝트 생성
  async function createProject(projectName) {
    try {
      const res = await API.post(`/team/${teamName}/create/${projectName}`);
      getProjectList(teamName);
    } catch (error) {
      console.error(error)
    }
  }

  const handleInputChange = (e) => {
    const { value } = e.target;
    setNewTeamName(value);
    setActive(value !== "");
  };

  const addTeam = () => {
    console.log(newTeamName + " 생성중");
    API
      .post(`/team/create/${newTeamName}`)
      .then((res) => {
        console.log(res);
        setOpenTeamModal(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dateFormatter = (date) => {
    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23' // 24시간 형식
    }).format(date);

    return formattedDate;
  }

  return (
    <>
      <Modal
        isOpen={openTeamModal}
        setIsOpen={setOpenTeamModal}
        addType="생성"
        kr="팀명"
        en="Team Name"
        value={newTeamName}
        name="newTeamName"
        active={active}
        onChange={handleInputChange}
        onClick={addTeam}
      />
      <div className="mainFrameCol" style={{ gap: "20px" }}>
        <div className="topFrameCenter">
          <button className="clickBtn" onClick={() => setOpenTeamModal(true)}>
            팀 생성
          </button>
        </div>
        <div className="scmPageFrame">
          <List className="listBtn" elementClassName="listElementBtn" listNames={teamList} onClick={getProjectList}></List>
          <List className="listBtn" elementClassName="listElementBtn" listNames={userList}></List>
          <List className="listBtn" elementClassName="listElementBtn" listNames={projectList} onClick={getCommitList}></List>
          <VerticalTimeline className="timeline">
            {commitList.map((item, index) => (
              <VerticalTimelineElement
                key={index}
                date={moment(item.createDate).format("YYYY-MM-DD HH:MM")}
                dateClassName="dateClass"
                iconStyle={{ background: "#FF7A00", color: "#000" }}
                contentStyle={{ background: "#FF7A00", color: "#000" }}
                contentArrowStyle={{ borderRight: `7px solid #FF7A00` }}
                position="right"
              >
                <h3 className="vertical-timeline-element-title">{teamName}</h3>
                <h4
                  className="vertical-timeline-element-subtitle"
                  style={{ opacity: "60%" }}
                >
                  {projectName}
                </h4>
                <p>#{item.comment}</p>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>
    </>
  );
}

export default ScmPage;