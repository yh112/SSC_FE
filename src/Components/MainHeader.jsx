import React from "react";
import { GGoPersonAdd, GoPersonAdd, GoShare } from "react-icons/go";
import { CgFolderAdd } from "react-icons/cg"
import { VscDebugStart } from "react-icons/vsc";
import API from "../BaseUrl";

function MainHeader({ teamName, projectName, projectList, setProjectName, setModalType, isOpened, setIsOpened }) {
    const openModal = (type) => {
        setModalType(type);
        setIsOpened(true);
    }

    return (
        <div className="main-header">
            <div className="selectBox">
                <select className="select" onChange={(e) => setProjectName(e.target.value)}>
                    <option disabled selected>프로젝트 선택</option>
                    {projectList?.map((project) => (
                        <option key={project} value={project}>{project}</option>
                    ))}
                </select>
            </div>
            <div className="buttons">
                {projectName.length != 0 && <GoShare size={25}/>}
                <GoPersonAdd size={25} onClick={openModal("user")}/>
                <CgFolderAdd size={25} onClick={openModal("team")}/>
            </div>
        </div>
    );
}

export default MainHeader;
