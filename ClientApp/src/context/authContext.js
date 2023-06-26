import { createContext, useState } from 'react';
import jwt_decode from "jwt-decode"
import {useNavigate} from "react-router-dom";

export const authContext = createContext();

export const AuthProvider = ({children}) => {
    let navigate = useNavigate()
    const [userData, setUserData] = useState(()=> localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    async function handleLogin(e) {
        e.preventDefault();
        try {
            let response = await fetch("api/Auth/login",
                {  
                    method:"POST", 
                    headers:{
                        'Content-Type':'application/json',
                        'Accept':'*/*'
                    }, 
                    body:JSON.stringify({userName:e.target.username.value, password:e.target.password.value})
                }
            )
            let data = await response.json();
            localStorage.setItem("authToken",data.token);
            setUserData(jwt_decode(data.token))
            window.location.href = "/"
        } catch (error) {
            alert(error);
        }

    }

    function handleLogout() {
        setUserData(null);
        localStorage.clear();
        navigate('/sign-in');
    }
    
    let contextData = {
        handleLogin: handleLogin,
        handleLogout: handleLogout,
        userData: userData,
        setUserData:setUserData
    }
    return(
        <authContext.Provider value={contextData}>
            {children}
        </authContext.Provider>
    )
}

export default authContext;
export const AuthConsumer = authContext.Consumer