import React from 'react'
import {Link, useNavigate} from "react-router-dom"

function ProfileSideBarComponent() {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear()
    navigate("/")
  }
  return (
    <div className="min-w-[12rem] bg-white px-4 py-2 shadow-lg">
        <ul>
            <li className="py-2"><Link className="no-underline text-black" to="/profile">Profile</Link></li>
            <li className="py-2"><Link className="no-underline text-black" to="/profile/saved-address">Saved Address</Link></li>
            <li className="py-2"><Link className="no-underline text-black" to="/profile/liked">Liked Arts</Link></li>
            <li className="py-2"><Link className="no-underline text-black" to="/profile/my-orders">My Orders</Link></li>
            <li className="py-2"><Link className="no-underline text-black" to="/sell-art">Sell Art</Link></li>
            <li className="py-2"><Link className="no-underline text-black" to="/profile/edit">Edit Profile</Link></li>
            <li className="py-2"><button onClick={handleLogout}>Logout</button></li>
        </ul>
    </div>
  )
}

export default ProfileSideBarComponent