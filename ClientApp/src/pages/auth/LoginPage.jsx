import React, { useContext, useEffect} from 'react'
import authContext from '../../context/authContext';
import {useNavigate} from "react-router-dom"

function LoginComponent() {
    const {handleLogin, userData} = useContext(authContext);
    let navigate = useNavigate()
    useEffect(() => {
      if(userData!=null){
        navigate(-1)
      }
    }, [])
    
  return (
    <div className="md:flex md:h-screen">
        <div className="bg-[url('abs.jpg')] w-full"></div>
        <div className="w-full md:px-60 my-auto">
            <form onSubmit={handleLogin}>
                <input className="w-full py-2 px-2 border-1 border-solid border-black my-3 rounded-md" type="text" name="username" placeholder="Enter Username"/>
                <input className="w-full py-2 px-2 border-1 border-solid border-black my-3 rounded-md" type="password" name="password" placeholder="Enter Password"/>
                <input className="w-full bg-blue-500 px-2 py-2 my-3 text-white rounded-md" type="submit" value="Login"/>
            </form>
        </div>
    </div>
  )
}

export default LoginComponent