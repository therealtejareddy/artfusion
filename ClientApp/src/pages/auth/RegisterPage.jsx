import React, { useState, useEffect, useContext} from 'react'
import {useNavigate} from "react-router-dom"
import authContext from '../../context/authContext';

function RegisterPage() {
    const {userData} = useContext(authContext);
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    useEffect(() => {
      if(userData!=null){
        navigate(-1)
      }
    }, [])
    async function handleSubmit(e) {
        e.preventDefault();
        if(password===confirmPassword){
            let response = await fetch("api/Auth/register",
                {  
                    method:"POST", 
                    headers:{
                        'Content-Type':'application/json',
                        'Accept':'*/*'
                    }, 
                    body:JSON.stringify({userName:userName, password:password, email:email})
                }
            )
            let data = await response.json();
            if(response.status===200){
                navigate('/sign-in')
            }
        }
    }
  return (
    <div className="md:flex md:h-screen">
        <div className="w-full md:px-60 my-auto">
            <form onSubmit={handleSubmit}>
                <input className="w-full py-2 px-2 border-1 border-solid border-black my-3 rounded-md" type="text" value={userName} onChange={(e)=>{setUserName(e.target.value)}} placeholder="Enter Username" required/>
                <input className="w-full py-2 px-2 border-1 border-solid border-black my-3 rounded-md" type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter Email" required/>
                <input className="w-full py-2 px-2 border-1 border-solid border-black my-3 rounded-md" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  placeholder="Enter Password" required/>
                <input className="w-full py-2 px-2 border-1 border-solid border-black my-3 rounded-md" type="password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}  placeholder="Re-Enter Password" required/>
                <input className="w-full bg-blue-500 px-2 py-2 my-3 text-white rounded-md" type="submit" value="Signup"/>
            </form>
        </div>
        <div className="bg-[url('abs.jpg')] w-full"></div>
    </div>
  )
}

export default RegisterPage