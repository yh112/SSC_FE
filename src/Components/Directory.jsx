import React, { useState } from "react";
import { Menu, MenuItem, Sidebar, SubMenu } from "react-pro-sidebar";

const Directory = ({ paths, selectedMenu, setSelectedMenu }) => {
  const [tree, setTree] = useState(buildTree(paths));
  const [isCollapsed, setIsCollapsed] = useState(false);
  // 파일 경로를 기반으로 트리를 생성하는 함수
  function buildTree(paths) {
    const treeData = {};

    paths.forEach((path) => {
      const pathParts = path.split("/");
      let currentNode = treeData;

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
    <Sidebar collapsed={isCollapsed}>
      <Menu>{visualizeTree(tree)}</Menu>
    </Sidebar>
  );
};

export default Directory;
