import React, { useState, useEffect, useContext} from 'react'
import {useNavigate} from "react-router-dom"
import authContext from '../../context/authContext';
import { Toaster } from 'react-hot-toast';
import {errorToast} from "./../../utils/utils.js"

function RegisterPage() {
    const {userData} = useContext(authContext);
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
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
                    body:JSON.stringify({firstName:firstName,lastName:lastName,userName:userName, password:password, email:email})
                }
            )
            let data = await response.json();
            if(response.status===200){
                navigate('/sign-in')
            }else if(response.status===409){
                errorToast(data.message)
            }
        }
    }
  return (
    <>
        <div className="md:flex md:h-screen">
            <div className="w-full md:px-60 my-auto">
                <h3 className="text-center mb-4">New User! Create Account</h3>
                <form onSubmit={handleSubmit}>
                    <input className="w-full py-2 px-2 border-1 border-solid border-black my-2 rounded-md" type="text" value={userName} onChange={(e)=>{setUserName(e.target.value)}} placeholder="Enter Username" required/>
                    <input className="w-full py-2 px-2 border-1 border-solid border-black my-2 rounded-md" type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="Enter Email" required/>
                    <div className="flex items-center w-full space-x-6">
                        <input className="w-full py-2 px-2 border-1 border-solid border-black my-2 rounded-md" type="text" value={firstName} onChange={(e)=>{setFirstName(e.target.value)}} placeholder="Enter First Name" required/>
                        <input className="w-full py-2 px-2 border-1 border-solid border-black my-2 rounded-md" type="text" value={lastName} onChange={(e)=>{setLastName(e.target.value)}} placeholder="Enter Last Name" required/>
                    </div>
                    <input className="w-full py-2 px-2 border-1 border-solid border-black my-2 rounded-md" type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}}  placeholder="Enter Password" required/>
                    <input className="w-full py-2 px-2 border-1 border-solid border-black my-2 rounded-md" type="password" value={confirmPassword} onChange={(e)=>{setConfirmPassword(e.target.value)}}  placeholder="Re-Enter Password" required/>
                    <input className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-2 py-2 my-3 text-white font-medium rounded-md" type="submit" value="Signup"/>
                </form>
            </div>
            <div className="bg-[url('abs.jpg')] w-full"></div>
        </div>
        <Toaster toastOptions={{
                error:{
            style:{
                padding:"24px",
        }
        }}} 
        containerStyle={{
                        top: 40,
                        right: 40
                    }}/>
    </>
  )
}

export default RegisterPage