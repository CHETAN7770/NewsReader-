
import React, {useEffect,useState} from "react";
import { auth } from '../src/app/Firebase'
import { onAuthStateChanged ,signOut } from "firebase/auth";

const AuthDetail = () => {
    const [user, setUser] = useState(null)
    useEffect(()=>{
        const listen = onAuthStateChanged(auth ,(user)=>{
            if(user) {
                setUser(user)
            }else{
                setUser(null)
            }
        })
        return()=>{
            listen();
        }

    }, [])

    const Signout = () => {
        signOut(auth)
        .then(()=>{
            console.log("sign out done")

        })
        .catch(()=>{
            console.log("sign out unsuccess")
            
        })
    }

    
    return(
        <div>
          
        </div>
    )
}

export default AuthDetail

