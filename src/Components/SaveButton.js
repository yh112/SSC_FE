import React from 'react'
import APT from './BaseUrl'
import API from '../BaseUrl'

const save = () => {
    //TODO: axios로 서버에 저장하는 로직 필요
    API
    .post("/anjffhgkwl", {
      
    })
}

function SaveButton() {
  return (
    <div>
      <button onClick={save}>Save</button>
    </div>
  )
}

export default SaveButton