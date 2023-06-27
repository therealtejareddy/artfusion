import React, {useContext, useEffect} from 'react'
import authContext from '../context/authContext'
import {useNavigate} from "react-router-dom"

function Home() {
  const { userData } = useContext(authContext);
    let navigate = useNavigate()
    useEffect(() => {
      if(userData!=null){
        navigate("/products")
      }
    }, [userData])
  return (
    <pre>{JSON.stringify(userData,undefined,2)}</pre>
  )
}

export default Home
