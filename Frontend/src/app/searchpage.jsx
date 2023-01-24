import { React, useState } from "react";
import react from "react";
import TextField from "@mui/material/TextField";
import "./searchbar.css";
import axios from "axios";

class SearchBar extends react.Component {
  constructor(props){
    super(props);
    this.state = {
        items: [],
        username: this.props.username 
    }
  } 

  addFriend = async(e) => {
    await axios.post("http://localhost:5000/friendship", {
      friend_1: this.state.username,
      friend_2: e
    });
    alert("the friend request has been sent!");
  }

  inputHandler = async(e) => {
    const response = await axios.get(`http://localhost:5000/player`);
    var username = e.target.value;
    var truncated = [];
    if(username.length > 0){ 
      for(let i = 0; i < response.data.length; i++){
        if(response.data[i].includes(username) && response.data[i] != this.state.username){
          truncated.push(response.data[i]);
        }
      }
      truncated = shuffleArray(truncated).slice(0,5);
      this.setState({items: truncated.map((suggestion) => 
      <li key={suggestion} >{suggestion}
        <button className="button-89" onClick={(e) => this.addFriend(e.target.id)} id={suggestion}>
          add friend
        </button>
    </li>)});
      this.setState({suggestions: []});
    }
    else{
      truncated = [];
      this.setState({items: truncated.map((suggestion) => <li className="sugg" key={suggestion}>{suggestion}</li>)});
    }
  }


  render(){
    return(
      <div className="main">
        <h3>Search for a new friend</h3>
        <div className="search">
          <TextField
            id="outlined-basic"
            onChange={this.inputHandler}
            variant="outlined"
            fullWidth
            label="Search"
          />
        </div>
        {this.state.items}
      </div>
    );
  }
}

export default SearchBar;

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array;
}