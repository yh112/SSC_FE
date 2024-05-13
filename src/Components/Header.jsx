import React from 'react'
import { GoUpload, GoX, GoPersonAdd } from "react-icons/go";
import API from '../BaseUrl';

function Header({teamName, projectName, comment}) {

  // 작업중인 파일 S3 업로드
  async function uploadToS3() {
    try {
      const res = await API.post(`/s3/upload`, {
        teamName: teamName,
        projectName: projectName,
        comment: comment
      });
      console.log(res.data);
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="header">
      <GoUpload onClick={() => uploadToS3()}/><GoPersonAdd/><GoX/>
    </div>
  )
}

export default Header;