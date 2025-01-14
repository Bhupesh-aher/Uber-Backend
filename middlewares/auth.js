const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const BlackListToken = require("../models/blackListToken");
const CaptainModel = require("../models/captain");

module.exports.userAuth = async(req, res, next) => {
 
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    if(!token){
        return res.status(401).json("please login")
    }

    const isBlockListed = await BlackListToken.findOne({token: token})

    if(isBlockListed){
        return res.status(401).json({message: "Unauthorized"})
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



module.exports.captainAuth = async(req, res, next) => {
 
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    if(!token){
        return res.status(401).json("please login")
    }

    const isBlockListed = await BlackListToken.findOne({token: token})

    if(isBlockListed){
        return res.status(401).json({message: "Unauthorized"})
    }

    try{
        const decodeUserId = jwt.verify(token, process.env.JWT_SECRET)
        const {_id} = decodeUserId;
        const captain = await CaptainModel.findById(_id)


        req.captain = captain;
        
        next();
    }
    catch(err){
        res.status(401).send("Error : " + err.message);
        
    }
}