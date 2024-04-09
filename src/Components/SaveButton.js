import React from 'react'

const save = () => {
    //TODO: axios로 서버에 저장하는 로직 필요
}

function SaveButton() {
  return (
    <div>
      <button onClick={save}>Save</button>
    </div>
  )
}

export default SaveButton