import React, {useState} from 'react'

function ProjectList({projectList}) {
    const [isAdditionalListVisible, setIsAdditionalListVisible] = useState(false);
  
    const toggleAdditionalList = () => {
      setIsAdditionalListVisible(!isAdditionalListVisible);
    };
  return (
    <div>
        <div className="projectList">
        <p onClick={toggleAdditionalList}>{projectList[0]}</p>
        {isAdditionalListVisible && projectList.slice(1).map((projectName, index) => (
          <p key={index + 1}>{projectName}</p>
        ))}
      </div>
    </div>
  )
}

export default ProjectList