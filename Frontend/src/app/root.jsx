import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './app.css';
import { useNavigate} from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";

async function setOffline(username){
  const patchResponse = await axios.patch(`http://localhost:5000/player/state/setoffline/${username}`);
}

export default function Root() {
  const location = useLocation();
  if(location.state != null){
    const user = location.state.username;
    setOffline(user);
  }
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");

  let [authMode, setAuthMode] = useState("signin")

  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin")
  }

  const login = async(e) => {
    e.preventDefault();
    const response = await axios.get(`http://localhost:5000/player/${username}`);
    if(response.data.length == 0){
      alert("There is not an account with this username");
    }
    else{
      if(password == response.data[0].password){
        const friendsResponse = await axios.get(`http://localhost:5000/friendship/${username}`);
        var friends = [];
        for(let i in friendsResponse.data){
          friends.push(friendsResponse.data[i].friend_2);
        }
        navigate('/home', {state: {username: username, friends : friends}});
      }
      else
      {
        alert("Wrong Password! Try again!");
      }
    }
} 

const signup = async(e) => {
  e.preventDefault();
  const response = await axios.get(`http://localhost:5000/player/${username}`);
  if(response.data.length == 0){
    if(password == confirmNewPassword){
      await axios.post("http://localhost:5000/player", {
        username: username,
        password: password,
        winstreak: 0,
      });
      navigate("/home", {state: {username: username, friends: []}});
    }
    else{
      alert("the two password fields are not equals!");
    }
  }
  else{
    alert("there is already a player with that username!");
  }
  
}

if (authMode === "signin") {
  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={login}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="text-center">
            Not registered yet?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign Up
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="username"
              className="form-control mt-1"
              placeholder="Enter username"
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
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" >
              Submit
            </button>
          </div>
        </div>
    </form>
    </div>
    );
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={signup}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="username"
              className="form-control mt-1"
              placeholder="e.g Jane Doe"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group mt-3">
            <label>Repeat Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          <p className="text-center mt-2">
            Forgot <a href="#">password?</a>
          </p>
        </div>
      </form>
    </div>
  )
}