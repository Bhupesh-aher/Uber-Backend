const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

module.exports.userAuth = async(req, res, next) => {
 
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];
    if(!token){
        return res.status(401).json("please login")
    }

    try{
        const decodeUserId = jwt.verify(token, process.env.JWT_SECRET)
        const {_id} = decodeUserId;
        const user = await User.findById(_id)

        if(!user){
            throw new Error("User not found")
        }

        req.user = user;
        
        next();
    }
    catch(err){
        res.status(401).send("Error : " + err.message);
        
    }
}