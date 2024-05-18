import React from "react";
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { GoArchive } from "react-icons/go";

const Nickname = ({ nickname, isCollapsed }) => {

    return (
        <Sidebar collapsed={isCollapsed} rootStyles={{
            border: 'none',
            [`.${sidebarClasses.container}`]: {
                background: "#272727",
            }}}
            >
            
        </Sidebar>
    );
};

export default Nickname;
