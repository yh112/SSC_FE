import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoPersonAdd, GoShare } from "react-icons/go";
import { CgFolderAdd } from "react-icons/cg";
import { RiFolderAddLine } from "react-icons/ri";
import API from "../BaseUrl";

const MainHeader = ({
  teamName,
  projectName,
  setModalType,
  isOpened,
  setIsOpened,
}) => {
  const openModal = (type) => {
    console.log(type);
    setModalType(type);
    setIsOpened(true);
  };

  let navigate = useNavigate();

  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getSnapshotList();
  }, [])

  async function getSnapshotList() {
    try {
      const res = await API.get(`/snapshot/list/${teamName}/${projectName}`);

      setFileList(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="main-header"><div style={{ width: "90%", display: "flex", justifyContent: "center" }}>
      {projectName != 0 && (
        <div style={{ fontSize: "large", fontWeight: "bold" }}>{projectName}</div>)}</div>
      <div className="buttons">
        {/* 프로젝트까지 눌려야 코드 에디터 오픈 */}
        {projectName.length != 0 &&
          <GoShare size={25} onClick={
            () => navigate(`/editor/${teamName}/${projectName}/${fileList.length == 0 ? "new" : "share"}`)} 
            />}
        {/* 팀이 눌려야 새로운 유저 추가 */}
        {teamName.length != 0 && (
          <>
            <GoPersonAdd size={25} onClick={() => openModal("user")} />
            <RiFolderAddLine size={25} onClick={() => openModal("project")} />
          </>
        )}
        {/* 팀이 눌려야 새로운 프로젝트 추가 */}
        <CgFolderAdd size={25} onClick={() => openModal("team")} />
      </div>
    </div>
  );
};

export default MainHeader;
