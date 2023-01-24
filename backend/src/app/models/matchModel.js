import { Sequelize } from "sequelize";
import db from "../config/database.js";
 
const { DataTypes } = Sequelize;

const ChessMatch = db.define('chessmatch',{
    player_1:{
        type: DataTypes.STRING
    },
    player_2:{
        type: DataTypes.STRING
    },
    winner:{
        type: DataTypes.INTEGER
    },
    waiting:{
        type: DataTypes.INTEGER
    }
},{
    freezeTableName: true
});
 
export default ChessMatch;