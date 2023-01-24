import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import NavBarFunction from "./navbar";
import './home.css';

class Stats extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.username,
            friends: this.props.friends,
            stats: {}
        }
    }

    componentDidMount(){
        this.getStats();
    }

    getStats = async () => {
        const response = await axios.get(`http://localhost:5000/chessmatch/${this.state.username}`);
        let count = 0;
        let count_wins = 0;
        for(let i in response.data){
            count = count + 1;
            if((response.data[i].player_1 == this.state.username && response.data[i].winner == 1) || (response.data[i].player_2 == this.state.username && response.data[i].winner == 2)){
                count_wins = count_wins + 1;
            }
        }
        let stats = {};
        stats["total_matches"] = count;
        stats["total_wins"] = count_wins;
        const bfResponse = await axios.get(`http://localhost:5000/chessmatch/bestfriend/${this.state.username}`);
        stats["best_friend"] = bfResponse.data;
        this.setState({stats: stats});
    }
    
    render(){
        return(
            <div className="stats">
                <NavBarFunction
                username = {this.state.username}
                stats = {this.state.stats}
                friends = {this.state.friends}
                />
                <div className="statsTable">
                <h1 className="statsTitle">Welcome back {this.state.username}</h1>
                <br/><br/><br/>
                <h3 className="statsTitle">Here are the stats of your previous matches!</h3>
                <br/>
                <br/>
                    <table id="table" class="table table-striped table-hover">
                        <tbody>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Value</th>
                            </tr>
                            <tr>
                                <th scope="row">Total Matches</th>
                                <td scope="col">{this.state.stats["total_matches"]}</td>
                            </tr>
                            <tr>
                                <th scope="row">Total Wins</th>
                                <td scope="col">{this.state.stats["total_wins"]}</td>
                            </tr>
                            <tr>
                                <th scope="row">Best Friend</th>
                                <td scope="col">{this.state.stats["best_friend"]}</td>
                            </tr>
                        </tbody>
                    </table>
                <br/><br/><br/>
                <h2 className="statsTitle">Challenge your friends, have fun</h2>
                <h2 className="statsTitle">and become the next chess master!</h2>
                </div>
                <br/><br/><br/><br/><br/>
                <h3 className="statsTitle">Creators of the platform:</h3>
                <h4 className="statsTitle">Marco Barezzi & Marco Calvi</h4>
            </div>
        );
    }   
}


export default function StatsSection(){
    const location = useLocation();
    const username = location.state.username;
    const friends = location.state.friends;
    return(
        <div className = "stats">
            <Stats username = {username} friends = {friends}/>
        </div>
    );  
}