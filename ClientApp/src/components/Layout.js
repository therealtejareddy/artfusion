import React, { useContext, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import NavMenu from './NavMenu';
import authContext from '../context/authContext';

export function Layout({children}) {
    let {userData} = useContext(authContext)
    let navigate = useNavigate()
    useEffect(() => {
      if(!userData){
      navigate('/')
    }
    }, [])
    
    return (
      <div>
        <NavMenu />
          {children}
      </div>
    );
}
