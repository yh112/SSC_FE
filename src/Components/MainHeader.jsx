import React from "react";
import { useNavigate } from "react-router-dom";
import { GoPersonAdd, GoShare } from "react-icons/go";
import { CgFolderAdd } from "react-icons/cg";
import { RiFolderAddLine } from "react-icons/ri";
import API from "../BaseUrl";

const MainHeader = ({
  teamName,
  projectName,
  projectList,
  setProjectName,
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

  return (
    <div className="main-header">
      <div>
        {teamName.length != 0 && (
          <div className="selectBox">
            <select
              className="select"
              onChange={(e) => setProjectName(e.target.value)}
            >
              <option disabled selected>
                프로젝트 선택
              </option>
              {projectList?.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="buttons">
        {/* 프로젝트까지 눌려야 코드 에디터 오픈 */}
        {projectName.length != 0 && <GoShare size={25}  onClick={() => navigate(`/editor/${teamName}/${projectName}/0`)}/>}
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
