import React from 'react'
import '../App.css';

const UserButton = ({text, onClick, active, disabled}) => {
  return (
    <button className={ active ? 'activeUserButton' : 'inactiveUserButton'} onClick={onClick} disabled={disabled}>{text}</button>
  )
}

export default UserButton