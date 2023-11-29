
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
           {user ? <><p>{`Signed In as  ${user.email}`}</p><button onClick={Signout}>Sign Out</button></> : <p>Signed Out</p>}
        </div>
    )
}

export default AuthDetail

