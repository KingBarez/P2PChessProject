import { React, useState } from "react";
import react from "react";
import TextField from "@mui/material/TextField";
import "./searchbar.css";
import {AiOutlineSend} from "react-icons/ai"
import Peer from "peerjs";

class Chat extends react.Component {
  constructor(props){
    super(props);
    this.state = {
        username: this.props.username,
        opponent: this.props.opponent,
        matchId: this.props.matchId,
        message: "",
        messages: []
    }
  } 

  componentDidMount() {
    this.interval = setInterval(this.scrollAuto, 100);
    const peer = new Peer("P2PChessBC-".concat(this.state.username).concat("-chat-").concat(this.state.matchId.toString()));
    peer.on('open', () => {
        this.setState({
        peer: peer
        });
    });

    peer.on('connection', (conn) => {
        conn.on('data', (data) => {
            this.setState({messages: data.message});
        });
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  scrollAuto(){
    var elem = document.getElementById('rectangle');
    elem.scrollTop = elem.scrollHeight;
  }

  inputHandler = () => {
    var getValue= document.getElementById("outlined-basic");
    if (getValue.value !="") {
        getValue.value = "";
        var msgs = this.state.messages.slice();
        msgs.push(this.state.username.concat(":  ").concat(this.state.message));
        this.setState({messages: msgs});
        this.send();
    }
  }

  send = async() => {
    const conn = await this.state.peer.connect("P2PChessBC-".concat(this.state.opponent).concat("-chat-").concat(this.state.matchId.toString()));

    conn.on('open', () => {

      const msgObj = {
        message: this.state.messages
      };

      conn.send(msgObj);
    });
  }

  handleChange = (e) => {
    this.setState({ message: e.target.value });
  }

  checkSend = (e) => {
    if (e.key === "Enter") {
        this.inputHandler();
    }
  }


  render(){
    return(
      <div className="main">
        <br/>
        <br/>
        <br/>
        <h3>Chat with your opponent</h3>
        <div className = "rectangle" id="rectangle">
            {this.state.messages.map(message => (
                <p style = {{textAlign: 'left'}}>{message} </p>
            ))}
        </div>
            <div className="search">
            <div className="input-field">
                <TextField id="outlined-basic"
                fullWidth
                label="Send a message"
                variant="outlined"
                size="small"
                onKeyUp={this.checkSend}
                onChange={this.handleChange}
                onkeypress/>
            </div>
            <div className="submit-message">
                    <AiOutlineSend size="42px" verticalAlign ="middle" onClick={this.inputHandler}/>
            </div>
        </div>
        {this.state.items}
      </div>
    );
  }
}

export default Chat;