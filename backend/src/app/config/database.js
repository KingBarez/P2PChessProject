import { Sequelize } from "sequelize";
 
const db = new Sequelize('peer2peer_chess_db', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});
 
export default db;