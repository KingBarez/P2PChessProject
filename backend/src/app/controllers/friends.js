import Friendship from "../models/friendshipModel.js";
import User from "../models/userModel.js";
import {Op} from "sequelize";
import ChessMatch from "../models/matchModel.js";

export const getAllFriends = async (req, res) => {
    try {
        const friends1 = await Friendship.findAll({
            attributes: [
                'friend_2'
            ],
            where: {
                friend_1: req.params.username, 
            }
        });
        const friends2 = await Friendship.findAll({
            attributes: [
                'friend_1'
            ],
            where: {
                friend_2: req.params.username, 
            }
        });
        var friends = [];
        for(let i = 0; i < friends1.length; i++){
            for(let j = 0; j < friends2.length; j++){
                if(friends1[i].friend_2 == friends2[j].friend_1){
                    friends.push(friends1[i]);
                }
            }
        }
        res.json(friends);
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const getOnlineFriends = async (req, res) => {
    try {
        const onlines = await User.findAll({
            where: {
                online: 1
            }
        });
        const friendsInGame = await ChessMatch.findAll({
            attributes: [
                'player_1',
                'player_2'
            ],
            where: {
                winner: 0,
                waiting: 0
            }
        });
        var fig = []
        for(let i = 0; i < friendsInGame.length; i++){
            fig.push(friendsInGame[i].player_1);
            fig.push(friendsInGame[i].player_2);
        }
        const friends1 = await Friendship.findAll({
            attributes: [
                'friend_2'
            ],
            where: {
                friend_1: req.params.username, 
            }
        });
        const friends2 = await Friendship.findAll({
            attributes: [
                'friend_1'
            ],
            where: {
                friend_2: req.params.username, 
            }
        });
        var friends = [];
        for(let i = 0; i < friends1.length; i++){
            for(let j = 0; j < friends2.length; j++){
                if(friends1[i].friend_2 == friends2[j].friend_1){
                    friends.push(friends1[i]);
                }
            }
        }
        var results = [];
        for(let i = 0; i < onlines.length; i++){
            for(let j = 0; j < friends.length; j++){
                if(onlines[i].username == friends[j].friend_2 && onlines[i].online){
                    results.push(onlines[i].username);
                }
            }
        }
        var fr = [];
        for(let i = 0; i < results.length; i++){
            var control = false;
            for(let j = 0; j < fig.length; j++){
                if(results[i] == fig[j]){
                    control = true;
                }
            }
            if(!control){
                fr.push(results[i]);
            }
        }
        
        res.json(fr);
        
        
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const deleteFriend = async (req, res) => {
    try {
        await Friendship.destroy({
            where: {
                [Op.and]: [
                    {friend_1: req.params.username},
                    {friend_2: req.params.friend}
                ]
            }
        });
        res.json({
            "message": "Friendship Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }
}

export const getPendingRequest = async (req, res) => {
    try{
        var requests = await Friendship.findAll({
            attributes: [
                'friend_1'
            ],
            where: {
                friend_2: req.params.username, 
            }
        });
        res.json(requests);
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const createFriendship = async (req, res) => {
    try {
        await Friendship.create(req.body);
        res.json({
            "message": "Product Created"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}