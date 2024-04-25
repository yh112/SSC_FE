import React, {useState} from "react";

function Folder({folderName, fileNames}) {
  console.log(fileNames);
  // const [isFileVisible, setIsFileVisible] = useState(false);
  const toggleFile = () => {
    console.log("File Opened");
    // setIsFileVisible(!isFileVisible);
  };
  return (
    <div className="folder">
      <p onClick={toggleFile}>{folderName}</p>
      {/* {isFileVisible && ( */}
        <div className="file">
          {fileNames.map((fileName, index) => (
            <p key={index}>{fileName}</p>
          ))}
        </div>
      {/* )} */}
    </div>
  );
}

export default Folder;
