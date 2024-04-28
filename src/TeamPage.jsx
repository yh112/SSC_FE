import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import List from "./Components/List";
import Modal from "./Components/Modal";
import API from "./BaseUrl";

function TeamPage() {
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openProjectModal, setOpenProjectModal] = useState(false);
  const [active, setActive] = useState(false);
  const [userName, setUserName] = useState(["규민", "이현", "준형"]);
  const [projectName, setProjectName] = useState([
    "Project1",
    "Project2",
    "Project3",
    "Project4",
    "Project5",
  ]);

  let { teamName } = useParams();

  useEffect(() => {
    getUsers();
  }, [])

  async function getUsers() {
    try {
      const res = await API.get(`/team/${teamName}/users`)

      setUserName(res.data);
    } catch (error) {
      console.error(error)
    }
  }

  const handleInputChange = (e) => {
    const { value } = e.target;
    setUserName(value);
    setActive(value !== "");
    console.log(userName);
  };

  const handleProjectChange = (e) => {
    const { value } = e.target;
    setProjectName(value);
    setActive(value !== "");
    console.log(projectName);
  };
  return (
    <>
      <Modal
        isOpen={openUserModal}
        setIsOpen={setOpenUserModal}
        addType="생성"
        kr="유저명"
        en="Nick Name"
        value={userName}
        name="userName"
        active={active}
        onChange={handleInputChange}
      />
      <Modal
        isOpen={openProjectModal}
        setIsOpen={setOpenProjectModal}
        addType="생성"
        kr="프로젝트명"
        en="Project Name"
        value={projectName}
        name="projectName"
        active={active}
        onChange={handleProjectChange}
      />
      <div className="mainFrameCol" style={{ gap: "20px" }}>
        <div className="topFrameCenter">
          <button className="clickBtn" onClick={() => setOpenUserModal(true)}>
            유저 추가
          </button>
          <button className="clickBtn" onClick={() => setOpenProjectModal(true)}>프로젝트 추가</button>
        </div>
        <div className="scmPageFrame">
          <List className="listBtn" elementClassName="listElementBtn" listNames={userName}></List>
          <List className="listBtn" elementClassName="listElementBtn" listNames={projectName}></List>
        </div>
      </div>
    </>
  );
}

export default TeamPage;