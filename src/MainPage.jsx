import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import Profile from "./Components/Profile";
import CommitList from "./Components/CommitList";
import MainHeader from "./Components/MainHeader";

function MainPage() {
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [active, setActive] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newProjectName, setNewProjectName] = useState("");

  const [nickname, setNickname] = useState("");
  const [teamName, setTeamName] = useState("");
  const [projectName, setProjectName] = useState("");

  const [teamList, setTeamList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [commitList, setCommitList] = useState([]);
  const [isOpened, setIsOpened] = useState(false);
  const [modalType, setModalType] = useState("");

  let navigate = useNavigate();

  useEffect(() => {
    getTeamList();
    getNickname();
  }, []);

  useEffect(() => {
    if (teamName == "") return;

    getUsers(teamName);
    getProjectList(teamName);
    setCommitList([]);
    setModalType("");
  }, [teamName]);

  useEffect(() => {
    if (projectName == "") return;

    console.log(projectName);
    getCommitList(projectName);
  }, [projectName]);

  // useEffect(() => {

  // }, [modalName])

  // 팀 목록 조회
  async function getTeamList() {
    try {
      const res = await API.get(`/team/list`);

      setTeamList(res.data);
      setCommitList([]);
      setUserList([]);
    } catch (error) {
      console.error(error);
    }
  }

  async function getNickname() {
    try {
      const res = await API.get(`/user/nickname`);
      setNickname(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 팀원 조회
  async function getUsers(teamName) {
    try {
      const res = await API.get(`/team/${teamName}/users`);

      setUserList(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 팀의 프로젝트 목록 조회
  async function getProjectList(teamName) {
    try {
      const res = await API.get(`/team/${teamName}/projects`);

      setProjectList(res.data);
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 프로젝트 커밋내역 조회
  async function getCommitList(projectName) {
    try {
      const res = await API.get(`/manage/list/${teamName}/${projectName}`);

      setCommitList(res.data);
      //   setIsOpened(false);

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  // 새로운 프로젝트 생성
  async function createProject() {
    try {
      if (projectList.includes(newProjectName) == true) {
        alert("이미 존재하는 프로젝트입니다.");
        setNewProjectName("");
        return;
      }
      const res = await API.post(`/team/${teamName}/create/${newProjectName}`);
      if (res.status === 200) {
        getProjectList(teamName);
        setNewProjectName("");
        setIsOpened(false);
      }
    } catch (error) {
      console.error(error);
    }
  }
  const handleInputChange = (e) => {
    if (modalType === "team") {
      setNewTeamName(e.target.value);
      newTeamName === "" ? setActive(false) : setActive(true);
    } else if (modalType === "user") {
      setNewUserName(e.target.value);
      newUserName === "" ? setActive(false) : setActive(true);
    } else if (modalType === "project") {
      setNewProjectName(e.target.value);
      newProjectName === "" ? setActive(false) : setActive(true);
    }
  };

  const addTeam = async () => {
    try {
      if (teamList.includes(newTeamName) == true) {
        alert("이미 존재하는 팀입니다.");
        setNewTeamName("");
        return;
      }
      const res = await API.post(`/team/create/${newTeamName}`);
      if (res.data === "success") {
        getTeamList();
        setNewTeamName("");
        setIsOpened(false);
      } else {
        alert("이미 존재하는 팀입니다.");
        setNewTeamName("");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addUser = async () => {
    try {
      if (userList.includes(newUserName) == true) {
        alert("이미 존재하는 사용자입니다.");
        setNewUserName("");
        return;
      }
      const res = await API.post(`/team/${teamName}/add/${newUserName}`);
      if (res.status === 200) {
        getUsers(teamName);
        setNewUserName("");
        setIsOpened(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpened}
        setIsOpen={setIsOpened}
        addType={modalType === "team" ? "생성" : "추가"}
        kr={
          modalType === "team"
            ? "팀명"
            : modalType === "project"
            ? "프로젝트명"
            : "팀원명"
        }
        en={
          modalType === "team"
            ? "Team Name"
            : modalType === "project"
            ? "Project Name"
            : "Nickname"
        }
        value={
          modalType === "team"
            ? newTeamName
            : modalType === "project"
            ? newProjectName
            : newUserName
        }
        name={
          modalType === "team"
            ? "newTeamName"
            : modalType === "project"
            ? "newProjectName"
            : "newUserName"
        }
        active={active}
        onChange={handleInputChange}
        onClick={
          modalType === "team"
            ? addTeam
            : modalType === "project"
            ? createProject
            : addUser
        }
      />
      <MainHeader
        teamName={teamName}
        setModalType={setModalType}
        isOpened={isOpened}
        setIsOpened={setIsOpened}
        projectName={projectName}
      />
      <div className="mainFrameRow" style={{ gap: "0" }}>
        <div className="col">
          <Profile
            teamName={teamName}
            nickname={nickname}
            teamList={teamList}
            projectList={projectList}
            setProjectName={setProjectName}
            participants={userList}
            setTeamName={setTeamName}
          />
        </div>
        <div className="project-list" style={{ gap: "20px", height: "100%" }}>
          <div className="project-element">
            <CommitList
              isOpened={commitList.length != 0}
              commitList={commitList}
              teamName={teamName}
              projectName={projectName}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
