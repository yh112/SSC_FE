import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { GoChevronLeft, GoChevronRight, GoFileDirectoryFill, GoFile } from "react-icons/go";
import API from "../BaseUrl";
import axios from "axios";

const Directory = ({ paths, selectedMenu, setSelectedMenu, isCollapsed, setIsCollapsed, setCode, getCode }) => {
  const [tree, setTree] = useState(buildTree(paths));
  // 파일 경로를 기반으로 트리를 생성하는 함수
  function buildTree(paths) {
    const treeData = {Files: {}};

    paths.forEach((path) => {
      const pathParts = path.split("/");
      let currentNode = treeData.Files;

      pathParts.forEach((part) => {
        if (!currentNode[part]) {
          currentNode[part] = {};
        }
        currentNode = currentNode[part];
        
      });

      // S3에 요청을 보내기 위한 파일명 저장 -> 디렉토리 제외한 파일들에만 삽입
      currentNode['path'] = path;
    });

    return treeData;
  }

  const handleItem = (e) => {
    console.log(e.target.innerText);
    setSelectedMenu(e.target.innerText);
  };

  function visualizeTree(node) {
    return Object.keys(node).map((key) => {
      const childNode = node[key];
      const isDirectory = !Object.keys(childNode).includes('path');

      return (
        <React.Fragment key={key}>
          {isDirectory ? (
            <SubMenu label={key} icon={<GoFileDirectoryFill/>} defaultOpen="true">{visualizeTree(childNode)}</SubMenu>
          ) : (
            <MenuItem active={selectedMenu === key} icon={<GoFile/>} onClick={() => getCode(childNode['path'])}>{key}</MenuItem>
          )}
        </React.Fragment>
      );
    });
  }

  return (
    <Sidebar collapsed={isCollapsed}  rootStyles={{ border: 'none',
        [`.${sidebarClasses.container}`]: {
          background:  "#272727",
        },
      }}>
        <div onClick={() => setIsCollapsed(!isCollapsed)} style={{ cursor: "pointer", padding: "10px", color: "white" }}>{isCollapsed ? <GoChevronRight /> : <GoChevronLeft/>}</div>
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
    }}>{visualizeTree(tree)}</Menu>
    </Sidebar>
  );
};

export default Directory;
