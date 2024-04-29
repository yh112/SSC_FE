import React from 'react'
import { GoUpload, GoX, GoPersonAdd } from "react-icons/go";

function Header() {
  return (
    <div className="header">
      <GoUpload/><GoPersonAdd/><GoX/>
    </div>
  )
}

export default Header;