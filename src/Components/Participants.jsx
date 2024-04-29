import React from "react";
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { GoPerson } from "react-icons/go";

const Participants = ({ participants, isCollapsed }) => {

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
      },
      [`.${menuClasses.menuItemRoot}`]: {
        background: "#272727",
        color: "white",
      },
    }}>
        <SubMenu label="Participants" defaultOpen="true">
        {participants.slice(0).map((participant, index) => (
          <MenuItem icon={<GoPerson/>} key={index}>{participant}</MenuItem>
        ))}
        </SubMenu>
    </Menu>
    </Sidebar>
  );
};

export default Participants;
