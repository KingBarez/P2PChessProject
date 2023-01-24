import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NavBarFunction from "./navbar";
import "./friendlist.css";
import { useNavigate} from "react-router-dom";
import SearchBar from "./searchpage";

function PendingRow(props){
    if(props.control){
        return(
            <tr>
                <td>
                    <button class="button" onClick = {props.onClick}>{props.pending}</button>
                    <button class="button button1" onClick = {props.acceptFriend}>Accept</button>
                    <button class="button button2" onClick = {props.refuseFriend}>Refuse</button>
                </td>
            </tr>
        )
    }
    else{
        return(
            <tr>
                <td><button class="button" onClick = {props.onClick}>{props.pending}</button></td>
            </tr>
        )
    }
    
}

class RequestsTable extends React.Component{
    renderRow(request, control){
        return (
            <PendingRow
            control = {control}
            pending = {request}
            onClick = {() => this.props.onClick(request)}
            acceptFriend = {() => this.props.acceptFriend()}
            refuseFriend = {() => this.props.refuseFriend()}
            />
        );
    }
   

    render(){
        var tabella = [];
        for(let j = 0; j < this.props.pendings.length; j++){
            var riga;
           if(this.props.pendings[j] == this.props.friendClicked){
                riga = this.renderRow(this.props.pendings[j], true);
           }
           else{
                riga = this.renderRow(this.props.pendings[j], false);
           }
           tabella.push(riga);
        }
        return(
            <table id="friend-table">{tabella}</table>
        );
    }
}

function Row(props){
    if(props.control){
        if(props.online){
            return(
                <tr>
                    <td>
                        <button class="button" onClick = {props.onClick}>{props.friend}</button>
                        <button class="button button1"onClick = {props.challengeClick}>Challenge</button>
                        <button class="button button2" onClick={props.removeClick}>Delete</button>
                    </td>
                </tr>
            )
        }
        else{
            return(
                <tr>
                    <td>
                        <button class="button" onClick = {props.onClick}>{props.friend}</button>
                        <button class="button button2" onClick={props.removeClick}>Delete</button>
                    </td>
                </tr>
            )
        }
    }
    else{
        return(
            <tr>
                <td><button class="button" onClick = {props.onClick}>{props.friend}</button></td>
            </tr>
        )
    }
    
}

class FriendTable extends React.Component{
    renderRow(friend, control, online){
        return (
            <Row
            control = {control}
            friend = {friend}
            online = {online}
            onClick = {() => this.props.onClick(friend)}
            removeClick = {() => this.props.removeClick()}
            challengeClick = {() => this.props.challengeClick()}
            />
        );
    }
   

    render(){
        var tabella = [];
        for(let j = 0; j < this.props.friends.length; j++){
            var riga;
           if(this.props.friends[j] == this.props.friendClicked){
                var online = false;
                for(let k = 0; k < this.props.onlines.length; k++){
                    if(this.props.friends[j] == this.props.onlines[k]){
                        online = true;
                    }
                }
                riga = this.renderRow(this.props.friends[j], true, online);
           }
           else{
                riga = this.renderRow(this.props.friends[j], false);
           }
           tabella.push(riga);
        }
        return(
            <table id="friend-table">{tabella}</table>
        );
    }
}

class ManageFriendlist extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            friendClicked : "",
            username: this.props.username,
            friends: this.props.friends,
            pendings: [],
            onlines: [],
            navigate: this.props.navigate
        }
    }

    componentDidMount() {
        this.onlineInterval = setInterval(this.updateOnlineList, 1000);
        this.pendigsInterval = setInterval(this.updatePendingsList, 1000);
      }

    componentWillUnmount() {
        clearInterval(this.onlineInterval);
        clearInterval(this.pendigsInterval);
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
    
    removeFriend = async() =>{
        const dfResponse1 = await axios.delete(`http://localhost:5000/friendship/${this.state.username}/${this.state.friendClicked}`);
        const dfResponse2 = await axios.delete(`http://localhost:5000/friendship/${this.state.friendClicked}/${this.state.username}`);
        const friendsResponse = await axios.get(`http://localhost:5000/friendship/${this.state.username}`);
        var friends = [];
        for(let i in friendsResponse.data){
          friends.push(friendsResponse.data[i].friend_2);
        }
        alert(`${this.state.friendClicked} has been removed from your friendlist!`);
        this.setState({friends: friends, friendClicked: ""});
    }

    acceptFriend = async() =>{
        await axios.post("http://localhost:5000/friendship", {
            friend_1: this.state.username,
            friend_2: this.state.friendClicked
        });
        const friendsResponse = await axios.get(`http://localhost:5000/friendship/${this.state.username}`);
        var friends = [];
        for(let i in friendsResponse.data){
          friends.push(friendsResponse.data[i].friend_2);
        }
        const prResponse = await axios.get(`http://localhost:5000/friendship/pendings/${this.state.username}`);
        var pendingRequests = [];
        for(let i in prResponse.data){
          var controller = false;
          for(let j = 0; j < friends.length; j++){
            if(prResponse.data[i].friend_1 == friends[j]){
              controller = true;
            }
          }
          if(!controller){
            pendingRequests.push(prResponse.data[i].friend_1);
          }
        }
        this.setState({friends : friends, pendings : pendingRequests, friendClicked: ""});
        alert("the friend request has been accepted!");
    }

    refuseFriend = async() =>{
        const dfResponse = await axios.delete(`http://localhost:5000/friendship/${this.state.friendClicked}/${this.state.username}`);
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
        this.setState({pendings: pendingRequests, friendClicked: ""});
        alert("the friend request has been refused!");
    }

    showButton(friend){
        var friendClicked = friend;
        this.setState({friendClicked : friendClicked});
    }  

    async challengeFriend(){
        await axios.post("http://localhost:5000/chessmatch", {
        player_1: this.state.username,
        player_2: this.state.friendClicked,
        winner: 0,
        waiting: 1
        });
        const response = await axios.get(`http://localhost:5000/chessmatch/match/id/number/${this.state.username}`);
    const matchId = response.data
        this.state.navigate("/game", {state: {username: this.state.username, friends: this.state.friends, opponent: this.state.friendClicked, player: 1, matchId: matchId}});
    }

    render(){
        return(
            <div className="friends">
                <NavBarFunction
                username = {this.state.username}
                friends = {this.state.friends}
                />
                <br/>
                <br/>
                <br/>
                <div className="friendslist">
                <br/>
                <br/>
                <h3>Your friendlist:</h3>
                <FriendTable
                friends = {this.state.friends}
                friendClicked = {this.state.friendClicked}
                onlines = {this.state.onlines}
                onClick = {i => this.showButton(i)}
                removeClick = {() => this.removeFriend()}
                challengeClick = {() => this.challengeFriend()}
                />
                <br/>
                <br/>
                <br/>
                </div>
                <div className="pendingRequests">
                <br/>
                <br/>
                <h3>Your pending requests:</h3>
                <RequestsTable
                friendClicked = {this.state.friendClicked}
                onClick = {i => this.showButton(i)}
                pendings = {this.state.pendings}
                refuseFriend = {() => this.refuseFriend()}
                acceptFriend = {() => this.acceptFriend()}
                />
                <br/>
                <br/>
                <br/>
                </div>
                <SearchBar username = {this.state.username}/>
            </div>
        );
    }
}


export default function Friendlist(){
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state.username;
    const friends = location.state.friends;
    return(
        <div className="manageFriendlist">
            <ManageFriendlist username = {username} friends = {friends} navigate = {navigate}/>
        </div>
    );
}