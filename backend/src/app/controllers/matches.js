import ChessMatch from "../models/matchModel.js";
import {Op} from "sequelize";

export const getAllMatches = async (req, res) => {
    try {
        const matches = await ChessMatch.findAll();
        if(res.json(matches[0]) == null){
            res.json(0);
        }
        else{
            res.json(matches[0]);
        }
        
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const getNotification =  async (req, res) => {
    try{
        const matches = await ChessMatch.findAll({
            attributes: [
                'player_1'
            ],
            where: {
                player_2: req.params.username, 
                winner: 0,
                waiting: 1
            }
        });
        var notifications = [];
        for(let  i = 0; i < matches.length; i++){
            notifications.push(matches[i].player_1);
        }
        res.json(notifications)
    }
    catch(error){
        res.json({ message: error.message });
    }
}

export const getMatchId = async (req, res) => {
    try{
        const match = await ChessMatch.findAll({
            attributes: [
                'id'
            ],
            where: {
                player_1: req.params.username,
                winner: 0
            }
        });
        res.json(match[0].id);
    }
    catch(error){
        res.json(null);
    }
}

export const getWaitingMatch =  async (req, res) => {
    try{
        const match = await ChessMatch.findAll({
            where: {
                id: req.params.matchId, 
            }
        });
        res.json(match[0])
    }
    catch(error){
        res.json(null);
    }
}

export const getBestFriend = async (req, res) => {
    try{
        const matches1 = await ChessMatch.findAll({
            attributes: [
                'player_2'
              ],
            where: {
                    player_1: req.params.username
            }
        });
        const matches2 = await ChessMatch.findAll({
            attributes: [
                'player_1'
              ],
            where: {
                    player_2: req.params.username
            }
        });
        var best;
        var max = 0;
        for(let i = 0; i < Object.keys(matches1).length; i++){
            var count = 0;
            for(let j = 0; j < Object.keys(matches1).length; j++){
                if(matches1[i].player_2 == matches1[j].player_2){
                    count++;
                }
            }
            for(let j = 0; j < Object.keys(matches2).length; j++){
                if(matches1[i].player_2 == matches2[j].player_1){
                    count++;
                }
            }
            if(count > max){
                max = count;
                best = matches1[i].player_2;
            }
        }
        for(let i = 0; i < Object.keys(matches2).length; i++){
            var count = 0;
            for(let j = 0; j < Object.keys(matches1).length; j++){
                if(matches2[i].player_1 == matches1[j].player_2){
                    count++;
                }
            }
            for(let j = 0; j < Object.keys(matches2).length; j++){
                if(matches2[i].player_1 == matches2[j].player_1){
                    count++;
                }
            }
            if(count > max){
                max = count;
                best = matches2[i].player_1;
            }
        }
        if(max === 0){
            res.json("you don't have any matches played!");
        }
        else{
            res.json(best);
        }
    }
    
    catch(error){
        res.json({ message: error.message });
    }
}

export const getMatchesOfAPlayer = async (req, res) => {
    try{
        const matches = await ChessMatch.findAll({
            where: {
                [Op.or]: [
                    {player_1: req.params.username},
                    {player_2: req.params.username}
                ]
            }
        });
        res.json(matches);
    }
    catch(error){
        res.json({ message: error.message });
    }
}
 
export const getMatchById = async (req, res) => {
    try {
        const matches = await ChessMatch.findAll({
            where: {
                id: req.params.id
            }
        });
        res.json(matches);
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const createMatch = async (req, res) => {
    try {
        await ChessMatch.create(req.body);
        res.json({
            "message": "Product Created"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const updateMatch = async (req, res) => {
    try {
        await ChessMatch.update({
            waiting: 0
        },
        {
            where: {
                player_1: req.params.player_1
            }
        });
        res.json({
            "message": "Product Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const winMatch = async (req, res) => {
    try {
        await ChessMatch.update({
            winner: req.params.player
        },
        {
            where: {
                [Op.or]:[
                    {player_1: req.params.username},
                    {player_2: req.params.username}
                ],
                winner: 0
            }
        });
        res.json({
            "message": "Product Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const deleteMatch = async (req, res) => {
    try {
        await ChessMatch.destroy({
            where: {
                player_1: req.params.username,
                winner: 0,
                waiting: 1
            }
        });
        res.json({
            "message": "Product Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const deleteMatchStarted = async (req, res) => {
    try {
        await ChessMatch.destroy({
            where: {
                [Op.or]: [
                  { player_1: req.params.username },
                  { player_2: req.params.username }
                ],
                waiting: 0,
                winner: 0
              }
        });
        res.json({
            "message": "Product Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}