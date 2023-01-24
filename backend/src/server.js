import express from "express";
import db from "./app/config/database.js";
import {router, routerMatches, routerFriends} from "./routes/index.js";
import cors from "cors";
 
const app = express();
 
try {
    await db.authenticate();
    console.log('Database connected...');
} catch (error) {
    console.error('Connection error:', error);
}
 
app.use(cors());
app.use(express.json());
app.use('/player', router);
app.use('/chessmatch', routerMatches);
app.use('/friendship', routerFriends);
app.listen(5000, () => console.log('Server running at port 5000'));