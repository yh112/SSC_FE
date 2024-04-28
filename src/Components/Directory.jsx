import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu, sidebarClasses, menuClasses } from "react-pro-sidebar";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";

const Directory = ({ paths, selectedMenu, setSelectedMenu, isCollapsed, setIsCollapsed }) => {
  const [tree, setTree] = useState(buildTree(paths));
  // 파일 경로를 기반으로 트리를 생성하는 함수
  function buildTree(paths) {
    const treeData = {files: {}};

    paths.forEach((path) => {
      const pathParts = path.split("/");
      let currentNode = treeData.files;

      pathParts.forEach((part) => {
        if (!currentNode[part]) {
          currentNode[part] = {};
        }
        currentNode = currentNode[part];
      });
    });

    console.log(treeData);

    return treeData;
  }

  const handleItem = (e) => {
    console.log(e.target.innerText);
    setSelectedMenu(e.target.innerText);
  };

  function visualizeTree(node) {
    return Object.keys(node).map((key) => {
      const childNode = node[key];
      const isDirectory = Object.keys(childNode).length > 0;

      return (
        <React.Fragment key={key}>
          {isDirectory ? (
            <SubMenu label={key} defaultOpen="true">{visualizeTree(childNode)}</SubMenu>
          ) : (
            <MenuItem active={selectedMenu === key} onClick={handleItem}>{key}</MenuItem>
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
