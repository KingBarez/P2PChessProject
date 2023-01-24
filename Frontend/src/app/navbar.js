import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './app.css';
import './friendlist.css';
import ManageFriendlist from './managefriendlist';
import {BiLogOutCircle} from 'react-icons/bi';
import { useLocation, useNavigate } from "react-router-dom";
import {useEffect} from 'react';
import axios from "axios";


 class ChessNavBar extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        navigate: this.props.navigate,
        username: this.props.username,
        friends: this.props.friends,
        pendings: [],
        onlines: [],
        notifications: [],
        message: "Manage requests (0)"
    }
  }

  componentDidMount() {
    this.messageInterval = setInterval(this.setMessage, 1000);
    this.notificationInterval = setInterval(this.getRequests, 1000);
    this.onlineListInterval = setInterval(this.updateOnlineList, 1000);
    this.pendingsInterval = setInterval(this.updatePendingsList, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.messageInterval);
    clearInterval(this.onlineListInterval);
    clearInterval(this.notificationInterval);
    clearInterval(this.pendingsInterval);
  }

  setMessage = () => {
    var n = this.state.notifications.length + this.state.pendings.length;
    var newMessage = "Manage requests (".concat(n.toString()).concat(")");
    this.setState({message: newMessage});
  }

  updatePendingsList = async() => {
    const prResponse = await axios.get(`http://localhost:5000/friendship/pendings/${this.state.username}`);
    var pendingRequests = [];
    for(let i in prResponse.data){
    var controller = false;
    for(let j = 0; j < this.state.friends.length; j++){
        if(prResponse.data[i].friend_1 == this.state.friends[j]){
        controller = true;
        }
    }
    if(!controller){
        pendingRequests.push(prResponse.data[i].friend_1);
    }
    
    }
    this.setState({pendings: pendingRequests});
  }

  updateOnlineList = async() =>{
    const onlineResponse = await axios.get(`http://localhost:5000/friendship/state/online/${this.state.username}`);
    var online = [];
    for(let i in onlineResponse.data){
      online.push(onlineResponse.data[i]);
    }
    this.setState({onlines: online});
  }

  getRequests = async() => {
    const response = await axios.get(`http://localhost:5000/chessmatch/append/notification/${this.state.username}`);
    var notifications = [];
    for(let i = 0; i < response.data.length; i++){
      notifications.push(response.data[i]); 
    }
    this.setState({notifications: notifications})
  }

  challengeFriend = async(online) =>{
    await axios.post("http://localhost:5000/chessmatch", {
    player_1: this.state.username,
    player_2: online,
    winner: 0,
    waiting: 1
    });
    const response = await axios.get(`http://localhost:5000/chessmatch/match/id/number/${this.state.username}`);
    const matchId = response.data;
    this.state.navigate("/game", {state: {username: this.state.username, friends: this.state.friends, opponent: online, player: 1, matchId: matchId}});
  }

  acceptFriend = async(accepted) =>{
    await axios.post("http://localhost:5000/friendship", {
        friend_1: this.state.username,
        friend_2: accepted
    });
    const friendsResponse = await axios.get(`http://localhost:5000/friendship/${this.state.username}`);
    var friends = [];
    for(let i in friendsResponse.data){
      friends.push(friendsResponse.data[i].friend_2);
    }
    this.setState({friends : friends});
    alert("the friend request has been accepted!");
  }

  refuseFriend = async(refused) =>{
    const dfResponse = await axios.delete(`http://localhost:5000/friendship/${refused}/${this.state.username}`);
    alert("the friend request has been refused!");
  }

  acceptChallenge = async(accepted) =>{
    const dfResponse = await axios.patch(`http://localhost:5000/chessmatch/accept/${accepted}`);
    const response = await axios.get(`http://localhost:5000/chessmatch/match/id/number/${accepted}`);
    const matchId = response.data;
    this.state.navigate("/game", {state: {username: this.state.username, friends: this.state.friends, opponent: accepted, player: 2, matchId: matchId}});
  }

  refuseChallenge = async(refused) => {
    const dfResponse = await axios.delete(`http://localhost:5000/chessmatch/${refused}`);
  }

  quitMatch = async() => {
    const response = await axios.delete(`http://localhost:5000/chessmatch/ingame/${this.state.username}`);
  }




  render(){
    return (
        <div className='navbar'>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Welcome {this.state.username}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
              <LinkContainer to={"/home"}
                          state={{username: this.state.username, friends: this.state.friends, stats: this.state.stats}}
              ><Nav.Link onClick = {() => this.quitMatch()}>Chess peer2peer</Nav.Link>
              </LinkContainer>
              <LinkContainer to={"/accountsettings"} 
                  state={{username: this.state.username, friends: this.state.friends, stats: this.state.stats}}>
                <Nav.Link onClick = {() => this.quitMatch()}>Account Settings</Nav.Link>
                </LinkContainer>




                <NavDropdown title={this.state.message} id="basic-nav-dropdown">
                <Nav.Link>
                        Manage challenges
                </Nav.Link>
                <NavDropdown.Item>
                {this.state.notifications.map(notification => (
                    <NavDropdown.Item>
                    <p style = {{textAlign: 'center'}}>{notification} </p>
                    <button class="buttonNav button3" onClick={() => this.acceptChallenge(notification)}>Accept</button><button class = "buttonNav button4" onClick={() => this.refuseChallenge(notification)}>Refuse</button>
                    </NavDropdown.Item>
                  ))}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                  <Nav.Link style={{textAlign: "center"}}>Friend request</Nav.Link>
                  {this.state.pendings.map(pending => (
                    <NavDropdown.Item>
                    <p style = {{textAlign: 'center'}}>{pending} </p>
                    <button class="buttonNav button3" onClick={() => this.acceptFriend(pending)}>Accept</button><button class = "buttonNav button4" onClick={() => this.refuseFriend(pending)}>Refuse</button>
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>




                <NavDropdown title="Friends" id="basic-nav-dropdown">
                  <NavDropdown.Item>
                    <LinkContainer to ={"/friends"}
                    state={{username: this.state.username, friends: this.state.friends, stats: this.state.stats}}>
                      <Nav.Link onClick = {() => this.quitMatch()}>
                        Manage Friendlist
                      </Nav.Link>
                    </LinkContainer>
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                <Nav.Link>Challenge...</Nav.Link>
                <NavDropdown.Item>
                {this.state.onlines.map(online => (
                    <NavDropdown.Item>
                    <button className="fakeButton" onClick={() => this.challengeFriend(online)}>{online}</button>
                    </NavDropdown.Item>
                  ))}
                </NavDropdown.Item>
                </NavDropdown>
                <LinkContainer to={"/"}
                state={{username: this.state.username}}>
                <Nav.Link onClick = {() => this.quitMatch()}><BiLogOutCircle/></Nav.Link>
                </LinkContainer>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        </div>
        
      );
    }
  }


    

  async function setOnline(username) {
    const patchResponse = await axios.patch(`http://localhost:5000/player/state/setonline/${username}`);
  }
  
  async function setOffline(username){
    const response = await axios.delete(`http://localhost:5000/chessmatch/ingame/${username}`);
    const patchResponse = await axios.patch(`http://localhost:5000/player/state/setoffline/${username}`);
  }

export default function NavBarFunction(){
    useEffect(() => {
      const handleTabClose = async (event) => {
        event.preventDefault();
        setOffline(username);
        return (event.returnValue = 'Chissà se funziona');
      };
    
      window.addEventListener('beforeunload', handleTabClose);
    
      return () => {
        window.removeEventListener('beforeunload', handleTabClose);
      };
    }, []);
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state.username;
    const friends = location.state.friends;
    setOnline(username);
    return(
        <div className="manageFriendlist">
            <ChessNavBar username = {username} friends = {friends} navigate = {navigate}/>
        </div>
    );
}