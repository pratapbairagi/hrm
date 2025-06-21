import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { loggedUser } from "./services/userService";


const AppWrapper = ({setAuth, setUser, children}) => {
    const navigate = useNavigate();

    useEffect(()=>{
        const check = async () => {
            try {
               const { success, user } = await loggedUser();
               console.log("auth ", user)
               if(success){
                   setAuth(true)
                   setUser(user)
                //    user.role === "admin" ? navigate("/") : navigate("/profile")
               }
            } catch (error) {
                navigate('/auth');
            }
        }
        check()
    },[])
    return children
}

export default AppWrapper;