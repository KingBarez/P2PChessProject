import User from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['username']
        });
        var usernames = [];
        for(let i = 0; i < users.length; i++){
            usernames.push(users[i].username);
        }
        res.json(usernames);
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const setOnline = async (req, res) => {
    try {
        await User.update( 
        {
            online: 1
        },
        {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "User Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const setOffline = async (req, res) => {
    try {
        await User.update( 
        {
            online: 0
        },
        {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "User Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const deletePeer = async (req, res) => {
    try {
        await User.update( 
        {
            peer_id: null
        },
        {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "User Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  

}

export const pushPeerID = async (req, res) => {
    try {
        await User.update( 
        {
            peer_id: req.params.peer
        },
        {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "User Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  

}
 
export const getUserByUsername = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                username: req.params.username
            }
        });
        res.json(users);
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const createUser = async (req, res) => {
    try {
        await User.create(req.body);
        res.json({
            "message": "Product Created"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const updateUser = async (req, res) => {
    try {
        await User.update( 
        {
            username: req.params.newusername
        },
        {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "User Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}

export const updatePassword = async (req, res) => {
    try {
        await User.update( 
        {
            password: req.params.password
        },
        {
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "User Updated"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}
 
export const deleteUser = async (req, res) => {
    try {
        await User.destroy({
            where: {
                username: req.params.username
            }
        });
        res.json({
            "message": "Product Deleted"
        });
    } catch (error) {
        res.json({ message: error.message });
    }  
}