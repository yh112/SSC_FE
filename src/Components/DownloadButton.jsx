import React from 'react'

const download = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById("code").innerText], { type: 'application/zip' }); //폴더 다운로드시 수정해야할듯
    element.href = URL.createObjectURL(file);
    element.download = "code.txt";
    document.body.appendChild(element);
    element.click();
}

function DownloadButton() {
  return (
    <div>
      <button onClick={download}>Download</button>
    </div>
  )
}

export default DownloadButton