import React from 'react'

function UserList(props) {
    const { userList } = props;
  return (
    <div className='userList'>
        <h3>참여자 목록</h3>
        <div className='users'>
            {userList.map((user, index) => (
            <p key={index}>{user}</p>
            ))}
        </div>
    </div>
  )
}

export default UserList