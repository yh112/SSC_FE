import React from "react";
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { GoArchive } from "react-icons/go";
import { RiTeamLine } from "react-icons/ri";
import { BsBuilding } from "react-icons/bs";


const TeamList = ({ label, teamList, isCollapsed, setTeamName }) => {

  return (
    <Sidebar collapsed={isCollapsed} rootStyles={{ border: 'none',
        [`.${sidebarClasses.container}`]: {
          background:  "#272727",
        },
      }}>
      <Menu
      rootStyles={{
      [`.${menuClasses.subMenuRoot}`]: {
        background: "#272727",
        color: "white",
        "&:focus": {
          background: "#505050", // 포커스 되었을 때의 배경색
          color: "white", // 포커스 되었을 때의 글자색
        },
        "&:hover": {
          background: "#505050", // 호버 되었을 때의 배경색
          color: "white", // 호버 되었을 때의 글자색
        },
      },
      [`.${menuClasses.menuItemRoot}`]: {
        background: "#272727",
        color: "white",
        // "&:focus": {
        //   background: "#505050", // 포커스 되었을 때의 배경색
        //   color: "white", // 포커스 되었을 때의 글자색
        // },
        "&:hover": {
          background: "#505050", // 호버 되었을 때의 배경색
          color: "white", // 호버 되었을 때의 글자색
        },
      },
    }}>
        <SubMenu label={label} defaultOpen="true">
        {teamList?.map((team, index) => (
          <MenuItem icon={label == "Project" ? <GoArchive/> : <BsBuilding/>} key={index} onClick={() => setTeamName(team)}>{team}</MenuItem>
        ))}
        </SubMenu>
    </Menu>
    </Sidebar>
  );
};

export default TeamList;
