import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NavBarFunction from "./app/navbar";

export default function ChangeCredentials(){
    const navigate = useNavigate();
    const location = useLocation();
    var username = location.state.username;
    const friends = location.state.friends;
    const [newUsername, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmNewPassword, setConfirmPassword] = useState("");
    

    const applyChange = async(e) => {
        e.preventDefault();
        var controllerUser = 0;
        var controllerPass = 0;
        if(newUsername != "" && newUsername != username){
            const response = await axios.get(`http://localhost:5000/player/${newUsername}`);
            if(response.data.length == 0){
                const cuResponse = await axios.patch(`http://localhost:5000/player/${username}/${newUsername}`);
                if(cuResponse.data.message == "User Updated"){
                    username = newUsername;
                    controllerUser = 1;
                }
                else{
                    alert("error! The username hasn't been changed!");
                    controllerUser = 2;
                }
            }
            else{
                controllerUser = 2;
            }
        }
        if(password != ""){
            if(password == confirmNewPassword){
                const cpResponse = await axios.patch(`http://localhost:5000/player/password/${username}/${password}`);
                controllerPass = 1;
            }
            else{
                controllerPass = 2;
            }
        }
        if((controllerUser == 1 && controllerPass == 1) || (controllerUser == 0 && controllerPass == 1) || (controllerUser == 1 && controllerPass == 0)){
            alert("Your credential have been changed");
            navigate('/home', {state: {username: username, friends : friends}});
        }
        else if(controllerPass == 1 && controllerUser == 2){
            alert("Your password has been changed but the username hasn't been changed: the choosen username is already in use!");
            navigate('/home', {state: {username: username, friends : friends}});
            
        }
        else if(controllerPass == 2 && controllerUser == 1){
            alert("Your Username has been changed but the password hasn't been changed: the two password fields are not equals!");
            navigate('/home', {state: {username: username, friends : friends}});
        }
        else if(controllerUser == 2 && controllerPass == 2){
            alert("The username hasn't been changed: the choosen username is already in use and the password hasn't been changed: the two password fields are not equals!");
        }
        else if(controllerUser == 2 && controllerPass == 0){
            alert("The username hasn't been changed: the choosen username is already in use!");
        }
        else if(controllerUser == 0 && controllerPass == 2){
            alert("The password hasn't been changed: the two password fields are not equals!");
        }
    }


    return(
        <div className = "pageContainer">
            <NavBarFunction
            username = {username}
            friends = {friends}
            />
            <div className="Auth-form-container">
                <form className="Auth-form" onSubmit={applyChange}>
                    <div className="Auth-form-content">
                    <h3 className="Auth-form-title">Change Credentials</h3>
                    <div className="text-center">
                        Insert the new credentials (repeat twice for password)
                    </div>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                        type="username"
                        className="form-control mt-1"
                        placeholder={`your current username: ${username}`}
                        onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                    <label>Password</label>
                        <input
                        type="password"
                        className="form-control mt-1"
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group mt-3">
                    <label>Password</label>
                        <input
                        type="password"
                        className="form-control mt-1"
                        placeholder="confirm new password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" >
                        Submit
                        </button>
                    </div>
                    </div>
                </form>
            </div>
        </div>
        
    );
}