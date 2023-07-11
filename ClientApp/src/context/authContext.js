import { createContext, useState } from 'react';
import jwt_decode from "jwt-decode"
import {useNavigate} from "react-router-dom";
import {errorToast} from "./../utils/utils"

export const authContext = createContext();

export const AuthProvider = ({children}) => {
    let navigate = useNavigate()
    const [userData, setUserData] = useState(()=> localStorage.getItem('authToken') ? jwt_decode(localStorage.getItem('authToken')) : null)
    const [userListedProducts, setUserListedProducts] = useState()
    const [userSoldOutProducts, setUserSoldOutProducts] = useState()
      
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
            if(response.status===400){
                let data = await response.text()
                console.log(data);
                errorToast(data);
            }
            if(response.status===200){
                let data = await response.json();
            localStorage.setItem("authToken",data.token);
            setUserData(jwt_decode(data.token))
            window.location.href = "/"
            }
        } catch (error) {
            console.log(error);
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
        setUserData:setUserData,
        userListedProducts:userListedProducts,
        userSoldOutProducts:userSoldOutProducts,
        setUserListedProducts:setUserListedProducts,
        setUserSoldOutProducts:setUserSoldOutProducts,
    }
    return(
        <authContext.Provider value={contextData}>
            {children}
        </authContext.Provider>
    )
}

export default authContext;
export const AuthConsumer = authContext.Consumer