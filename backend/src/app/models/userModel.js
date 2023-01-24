import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Friendship from "./friendshipModel.js";
 
const { DataTypes } = Sequelize;
 
const User = db.define('player',{
    username:{
        type: DataTypes.STRING
    },
    password:{
        type: DataTypes.STRING
    },
    winstreak:{
        type: DataTypes.INTEGER
    },
    online:{
        type: DataTypes.BOOLEAN
    }
},{
    freezeTableName: true
});


export default User;