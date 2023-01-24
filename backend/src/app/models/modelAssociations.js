import User from "./userModel";
import Friendship from "./friendshipModel";

User.hasMany(Friendship);
Friendship.belongsTo(User, {foreignKey: "user_2"});