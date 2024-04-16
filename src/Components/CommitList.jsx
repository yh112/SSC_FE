import React, { useState } from "react";

function CommitList({ commitList }) {
  const [openIndex, setOpenIndex] = useState(null);

  const openComment = (index) => {
    console.log("openComment", index);
    return () => setOpenIndex(index);
  };

  const closeComment = () => {
    setOpenIndex(null);
  };

  const openDirectories = (index) => {
    //TODO: 백엔드에서 해당 커밋의 디렉토리 정보를 가져와야 합니다.
    console.log("openDirectories", index);
  };

  return (
    <div>
      <div style={{position: "relative"}} className="commitList">
        {commitList.map((commit, index) => (
          <div key={index}>
            {openIndex === index && (
              <p onClick={openDirectories} style={{ position: "absolute", color: "blue", margin: "0px", marginLeft: "10px", backgroundColor: "beige" }}>{commit}</p>
            )}
            <div
              onClick={openDirectories(index)}
              onMouseOver={openComment(index)}
              //onMouseOut={closeComment}
              style={{
                height: "30px",
                width: "30px",
                backgroundColor: "black",
                marginLeft: "10px",
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommitList;
