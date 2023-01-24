import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Rook, Knight, Bishop, King, Queen, Pawn} from './pieces.js';
import {IoIosPin} from 'react-icons/io';
import {FcRating} from 'react-icons/fc';
import {MdOutlineArrowBackIosNew} from 'react-icons/md'
import {MdOutlineArrowForwardIos} from 'react-icons/md'
import NavBarFunction from './navbar';
import axios from 'axios';
import Peer from 'peerjs';
import Chat from './chat';
import { useLocation, useNavigate } from "react-router-dom";

function Square(props) {
    if(!props.historyboard){
        if(props.piece == null){
            var control = false;
            for(let i in props.possDest){
                if(props.possDest[i] == props.position){
                    control = true;
                }
            }
            //here it prints an empty cell
            if(!control){
                return(
                    <button className={"square-" + props.color}
                    >
                    </button>
                )
            }
            //here it prints the possible moves cells
            else{
                return(
                    <button className={"square-" + props.color + " poss-moves"}
                    onClick = {props.onClick}
                    > <IoIosPin/>
                    </button>
                )
            }
            
        }
        // here it prints the pieces on the board
        else{
            for(let i in props.possDest){
                if(props.possDest[i] == props.position){
                    control = true;
                }
            }
            if(!control){
                return(
            
                    <button className={"square-" + props.color}
                    style={props.piece.style}
                    onClick = {props.onClick}
                    >
                    </button>
                );
            }
            else{
                return(
            
                    <button className={"square-" + props.color}
                    style={props.piece.style}
                    onClick = {props.onClick}
                    >
                        <FcRating/>
                    </button>
                );
            }
        }
    }
    else{
        if(props.piece == null){
            return(
                <button className={"historysquare-" + props.color}>
                </button>
            );        
        }
        else{
            return(
                <button className={"historysquare-" + props.color}
                style={props.piece.style}
                >
                </button>
            );
        }
    }
}

function Change(props){
    return(
        <button className = {"square-change"}
        style = {props.piece.style}
        onClick = {props.onClick}
        >
        </button>
    )
}

function ShowAlert(props){
    if(props.showMessage){
        if(props.alert == "You have won!"){
            return(
                <div>
                    <h5 className='alertWon'>{props.alert}</h5>
                    <button className='buttonOk' onClick={props.onClick}>Ok</button>
                </div>
            );
        }
        else if(props.alert == "You have lost!"){
            return(
                <div>
                    <h5 className='alertLost'>{props.alert}</h5>
                    <button className='buttonOk' onClick={props.onClick}>Ok</button>
                </div>
            );
        }
        else{
            return(
                <div>
                    <h5 className='alert'>{props.alert}</h5>
                    <button className='buttonOk' onClick={props.onClick}>Ok</button>
                </div>
            );
        }
    }
}

function ChangePiece(props){
    if(props.changePawn){
        if(props.player == 1){
            return(
                <div>
                <Change
                    piece = {new Rook(1, "Rook")}
                    onClick = {() => props.onClick(new Rook(1, "Rook"))}
                    />
                    <Change
                    piece = {new Knight(1, "Knight")}
                    onClick = {() => props.onClick(new Knight(1, "Knight"))}
                    />
                    <Change
                    piece = {new Bishop(1, "Bishop")}
                    onClick = {() => props.onClick(new Bishop(1, "Bishop"))}
                    />
                    <Change
                    piece = {new Queen(1, "Queen")}
                    onClick = {() => props.onClick(new Queen(1, "Queen"))}
                    />
                </div>
            );
        }
        else{
            return(
                <div>
                <Change
                    piece = {new Rook(2, "Rook")}
                    onClick = {() => props.onClick(new Rook(2, "Rook"))}
                    />
                    <Change
                    piece = {new Knight(2, "Knight")}
                    onClick = {() => props.onClick(new Knight(2, "Knight"))}
                    />
                    <Change
                    piece = {new Bishop(2, "Bishop")}
                    onClick = {() => props.onClick(new Bishop(2, "Bishop"))}
                    />
                    <Change
                    piece = {new Queen(2, "Queen")}
                    onClick = {() => props.onClick(new Queen(2, "Queen"))}
                    />
                </div>
            );
        }
    }
    return(
        <div className='emptyChange'></div>
    );
        
        
    
}
class Board extends React.Component{
    renderSquare(c, n){
        return (
            <Square
            color = {c}
            position = {n}
            piece = {this.props.squares[n]} 
            possDest = {this.props.possDest}
            onClick = {() => this.props.onClick(n)}
            historyboard = {this.props.historyboard}
            />
        );
    }
   

    render(){ 
        const chessBoard = []
        var count = 0;
        for(let i = 0; i < 8; i++){
            const rowSquares = [];
            for(let j = 0; j < 8; j++){  
                if((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)){
                    rowSquares.push(this.renderSquare('w', count));
                }
                else{
                    rowSquares.push(this.renderSquare('b', count));
                }
                count++;
                
            }
            if(!this.props.historyboard){
                chessBoard.push(<div className='board-row'>{rowSquares}</div>);
            }
            else{
                chessBoard.push(<div className='historyboard-row'>{rowSquares}</div>);
            }
        }
        if(!this.props.historyboard){
            return(
                <div className='chess-board'>
                    {chessBoard}
                </div>
            );
        }
        else{
            return(
                <div className='historychess-board'>
                    {chessBoard}
                </div>
            );
        }
        
    }
}

class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            player : this.props.player,
            opponent : this.props.opponent,
            username : this.props.username,
            friends : this.props.friends,
            squares : this.props.squares,
            history : this.props.history,
            matchId: this.props.matchId,
            sender: this.props.username,
            alert: "",
            showMessage: false,
            peer : {},
            message: '',
            messages: [],
            accepted: false,
            possDest : null,
            whiteIsNext : true,
            moveState : -1,
            change : -1,
            changePawn : false,
            controlPawn : false,
            waitingTime : 0,
            N_mossa : 0,
            current_move : 0,
            navigate: this.props.navigate
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.checkChallenge, 1000);
        const peer = new Peer("P2PChessBC-".concat(this.state.username).concat("-match-").concat(this.state.matchId.toString()));
    
        peer.on('open', () => {
            this.setState({
            peer: peer
            });
        });
    
        peer.on('connection', (conn) => {
            conn.on('data', (data) => {
                var newSquares = [];
                for(let i = 0; i < data.message.length; i++){
                    var pos = null;
                    if(data.message[i] != null){
                        if(data.message[i].piece == "Pawn"){
                            pos = new Pawn(data.message[i].player, data.message[i].piece, data.message[i].justMove, data.message[i].countMove);
                        }
                        else if(data.message[i].piece == "Bishop"){
                            pos = new Bishop(data.message[i].player, data.message[i].piece, data.message[i].justMove, data.message[i].countMove);
                        }
                        else if(data.message[i].piece == "Knight"){
                            pos = new Knight(data.message[i].player, data.message[i].piece, data.message[i].justMove, data.message[i].countMove);
                        }
                        else if(data.message[i].piece == "Queen"){
                            pos = new Queen(data.message[i].player, data.message[i].piece, data.message[i].justMove, data.message[i].countMove);
                        }
                        else if(data.message[i].piece == "King"){
                            pos = new King(data.message[i].player, data.message[i].piece, data.message[i].justMove, data.message[i].countMove);
                        }
                        else if(data.message[i].piece == "Rook"){
                            pos = new Rook(data.message[i].player, data.message[i].piece, data.message[i].justMove, data.message[i].countMove);
                        }
                    }
                    newSquares.push(pos);
                }
                var whiteIsNext = !this.state.whiteIsNext
                var N_mossa = this.state.N_mossa + 1;
                var current_move = this.state.N_mossa;
                var history = this.state.history.slice();
                history.push(newSquares);
                this.setState({
                    messages: [...this.state.messages, data],
                    squares: newSquares,
                    whiteIsNext: whiteIsNext,
                    current_move: current_move,
                    history: history,
                    N_mossa: N_mossa
                });
            });
        });
      }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    send = async() => {
        const conn = await this.state.peer.connect("P2PChessBC-".concat(this.state.opponent).concat("-match-").concat(this.state.matchId.toString()));
    
        conn.on('open', () => {
    
          const msgObj = {
            sender: this.state.sender,
            message: this.state.message,
          };
    
          conn.send(msgObj);
    
          this.setState({
            messages: [...this.state.messages, msgObj],
            message: ''
          });
    
        });
    }

    checkChallenge = async() =>{
        if(this.state.player == 1){
            const response = await axios.get(`http://localhost:5000/chessmatch/waiting/${this.state.matchId}`);
            if(response.data.waiting == 1 && this.state.accepted == false){
                this.setState({waitingTime: this.state.waitingTime + 1});
            }
            else if(response.data.waiting == 0 && this.state.accepted == false){
                this.setState({accepted: true});
                alert(this.state.opponent.concat(" has joined the match!"));

            }
            else if(response.data == ''){
                if(this.state.accepted){
                    this.setState ({alert: "Your opponent has left the match!", showMessage: true});
                }
                else{
                    this.setState ({alert: "Your opponent has refused the match!", showMessage: true});
                }
            }
            if(this.state.waitingTime >= 60){
                this.setState ({alert: "Your opponent has not joined the match!", showMessage: true});
                const response = await axios.delete(`http://localhost:5000/chessmatch/${this.state.username}`);
            }
            if(response.data.winner == 1){
                this.setState ({alert: "You have won!", showMessage: true});
            }
            else if(response.data.winner == 2){
                this.setState ({alert: "You have lost!", showMessage: true});
            }
        }
        else if(this.state.player == 2){
            const response = await axios.get(`http://localhost:5000/chessmatch/waiting/${this.state.matchId}`);
            if(response.data == ''){
                this.setState ({alert: "Your opponent has left the match!", showMessage: true});
            }
            else if(response.data.waiting == 0 && this.state.accepted == false){
                this.setState({accepted: true});
            }
            if(response.data.winner == 2){
                this.setState ({alert: "You have won!", showMessage: true});
            }
            else if(response.data.winner == 1){
                this.setState ({alert: "You have lost!", showMessage: true});
            }
        }
    }

    backHome(){
        this.setState({alert: "", showMessage: false});
        this.state.navigate('/home', {state: {username: this.state.username, friends : this.state.friends}});
    }    

    handleClick = async(i) =>{
        if(this.state.accepted){
            if(!this.state.changePawn){
                if(this.state.moveState == -1){
                    const squares = this.state.squares.slice();
                    if(squares[i] != null){
                        if(this.state.player == 1 && this.state.whiteIsNext){
                            if(squares[i].getPlayer() == 1){
                                const possDest = squares[i].availableMoves(squares, i, this.state.player, true);
                                this.setState({possDest : possDest});
                                this.setState({moveState : i});
                            }
                        }
                        else if(this.state.player == 2 && !this.state.whiteIsNext){
                            if(squares[i].getPlayer() == 2){
                                const possDest = squares[i].availableMoves(squares, i, this.state.player, true);
                                this.setState({possDest : possDest});
                                this.setState({moveState : i});
                            }
                        }
                        
                    }
                }
                else{
                    var possDest = this.state.possDest.slice();
                    var squares = this.state.squares.slice();
                    var moveState = this.state.moveState;
                    var control = false;
                    for(let j in possDest){
                        if(possDest[j] == i){
                            control = true;
                        }
                    }
                    if(control){
                        if(moveState == 60 &&  !squares[moveState].hasBeenMoved){
                            if(i == 58){
                                squares[59] = squares[56];
                                squares[56] = null;
                            }
                            if(i == 62){
                                squares[61] = squares[63];
                                squares[63] = null;
                            }
                        }
                        if(moveState == 4 &&  !squares[moveState].hasBeenMoved){
                            if(i == 2){
                                squares[3] = squares[0];
                                squares[0] = null;
                            }
                            if(i == 6){
                                squares[5] = squares[7];
                                squares[7] = null;
                            }
                        }
                        if(squares[moveState].constructor.name == "Pawn" && squares[i] == null){
                            if(i - moveState == 9 || i - moveState == 7){
                                squares[i - 8] = null;
                            }
                            else if(i - moveState == -9 || i - moveState == -7){
                                squares[i + 8] = null;
                            }
                        }
                        squares[i] = squares[moveState];
                        squares[moveState] = null;
                        squares[i].addMove();
                        if(squares[i].constructor.name == "Pawn" && (i >= 56 || i < 8)){
                            await this.setState({
                                changePawn: true,
                                controlPawn: true,
                                change: i
                            });
        
                        }
                        if(squares[i].constructor.name == "Rook" || squares[i].constructor.name == "King"){
                            squares[i].setAsMoved();
                        }
                        
                        var possibleChess = squares[i].availableMoves(squares, i, this.state.player, false);
                        var chess = false;
                        for(let j = 0; j < possibleChess.length; j++){
                            if(squares[possibleChess[j]] != null)
                            if(squares[possibleChess[j]].constructor.name == "King" && squares[possibleChess[j]].getPlayer() != squares[i].getPlayer()){
                                chess = true;
                            }
                        }
                        if(chess){
                            var destTemp=[];
                            for(let j = 0; j < 64; j++){
                                if(squares[j] != null){
                                    if(this.state.player == 1){
                                        if(squares[j].getPlayer() == 2){
                                            destTemp = destTemp.concat(squares[j].availableMoves(squares, j, 2, true));
                                        }
                                    }
                                    else{
                                        if(squares[j].getPlayer() == 1){
                                            destTemp = destTemp.concat(squares[j].availableMoves(squares, j, 1, true));
                                        }
                                    }
                                }
                            }
                            if(destTemp.length == 0){
                                await axios.patch(`http://localhost:5000/chessmatch/match/win/${this.state.player}/${this.state.username}`);
                            }
                        }
                        moveState = -1;
                        possDest = null;
                        var N_mossa = this.state.N_mossa + 1;
                        var current_move = this.state.N_mossa;
                        var history = this.state.history.slice();
                        history.push(squares);
                        var whiteIsNext = !this.state.whiteIsNext;
                        this.setState(
                            {
                                squares : squares,
                                possDest : possDest,
                                moveState : moveState,
                                whiteIsNext : whiteIsNext,
                                N_mossa : N_mossa,
                                history : history,
                                current_move : current_move,
                                message: squares
                            }
                        );
                        if(!this.state.changePawn){
                            this.send();
                        }
                    }
                    else{
                        if(this.state.player == 1){
                            if(squares[i].getPlayer() == 1){
                                const possDest = squares[i].availableMoves(squares, i, this.state.player, true);
                                this.setState({possDest : possDest});
                                this.setState({moveState : i});
                            }
                        }
                        else{
                            if(squares[i].getPlayer() == 2){
                                const possDest = squares[i].availableMoves(squares, i, this.state.player, true);
                                this.setState({possDest : possDest});
                                this.setState({moveState : i});
                            }
                        }
                    }  
                    
                }
            }
        }
    }

    changeP(i){
        var chessBoard = this.state.squares.slice();
        chessBoard[this.state.change] = i;
        this.setState({squares : chessBoard, 
                        message: chessBoard,   
                        changePawn : false});

        this.send();

    }

    prev(){
        if(this.state.current_move > 0){
            var current_move = this.state.current_move;
            current_move--;
            this.setState({current_move : current_move});
        }
    }

    succ(){
        if(this.state.N_mossa - 1 > this.state.current_move){
            var current_move = this.state.current_move;
            current_move++;
            this.setState({current_move : current_move});
        }
        
    }

    render(){
        return(
            <div>
                <div>
                <NavBarFunction
                username = {this.state.username}
                friends = {this.state.friends}
                />
                </div>
                <div className='showAlert'>
                    <ShowAlert
                        alert = {this.state.alert}
                        showMessage = {this.state.showMessage}
                        onClick = {() =>this.backHome()}
                    />
                </div>
                <div className='changePawn'>
                    <ChangePiece 
                        changePawn = {this.state.changePawn}
                        onClick = {i => this.changeP(i)}
                        player = {this.state.player}
                    />
                </div>
                <div>
                    <Board
                    possDest = {this.state.possDest}
                    squares = {this.state.squares}
                    onClick = {i => this.handleClick(i)}
                    moveState = {this.state.moveState}
                    change = {this.state.change}
                    historyboard = {false}
                    />
                </div>
                <div>
                    
                </div>
                <div className='back-for'>
                    <br/><br/><br/><br/>
                    <button className = "button5" onClick={() => this.prev()}><MdOutlineArrowBackIosNew/></button>
                    <button className = "button6" onClick={() => this.succ()}><MdOutlineArrowForwardIos/></button>
                </div>
                <div className='history-board'>
                    <Board
                        squares = {this.state.history[this.state.current_move]}
                        historyboard = {true}
                    />
                </div>
                <div className='chat'>
                    <Chat username = {this.state.username} opponent = {this.state.opponent} matchId = {this.state.matchId}/>
                </div>
            </div>
        );
    }
}


export default function GameFunction(){
    const location = useLocation();
    const navigate = useNavigate();
    const username = location.state.username;
    const friends = location.state.friends;
    const player = location.state.player;
    const opponent = location.state.opponent;
    const matchId = location.state.matchId;
    const squares = [new Rook(2, "Rook"), new Knight(2, "Knight"), new Bishop(2, "Bishop"), new Queen(2, "Queen"), new King(2, "King"), new Bishop(2, "Bishop"), new Knight(2, "Knight"), new Rook(2, "Rook"),
        new Pawn(2, "Pawn"), new Pawn(2, "Pawn"), new Pawn(2, "Pawn"), new Pawn(2, "Pawn"), new Pawn(2, "Pawn"), new Pawn(2, "Pawn"), new Pawn(2, "Pawn"), new Pawn(2, "Pawn"),
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        new Pawn(1, "Pawn"), new Pawn(1, "Pawn"), new Pawn(1, "Pawn"), new Pawn(1, "Pawn"), new Pawn(1, "Pawn"), new Pawn(1, "Pawn"), new Pawn(1, "Pawn"), new Pawn(1, "Pawn"),
        new Rook(1, "Rook"), new Knight(1, "Knight"), new Bishop(1, "Bishop"), new Queen(1, "Queen"), new King(1, "King"), new Bishop(1, "Bishop"), new Knight(1, "Knight"), new Rook(1, "Rook")];
    var history = [];
    history.push(squares);
    return(
        <div className="manageFriendlist">
            <Game username = {username} friends = {friends} squares = {squares} history = {history} player = {player} opponent = {opponent} matchId = {matchId} navigate = {navigate}/>
        </div>
    );
}