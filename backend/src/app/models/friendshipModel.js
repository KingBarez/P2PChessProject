import { Sequelize } from "sequelize";
import db from "../config/database.js";
import User from "./userModel.js";
 
const { DataTypes } = Sequelize;

const Friendship = db.define('friendship',{
    friend_1:{
        type: DataTypes.STRING
    },
    friend_2:{
        type: DataTypes.STRING
    }
},{
    freezeTableName: true
});

export default Friendship;