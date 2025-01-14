const User = require("../models/user");
const userService = require("../services/userService")
const {validationResult} = require("express-validator")
const BlackListToken = require("../models/blackListToken")

module.exports.registerUser = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.staus(400).json({errors: errors.array()})
    }

    const {fullname, email, password} = req.body;

    const isUserAlreadyExists = User.findOne({email});
    if(isUserAlreadyExists){
        return res.status(400).json({message: "User Already Exist"});
    }


    const hashPassword = await User.hashPassword(password)

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname, 
        email,
        password: hashPassword
    });

    const token = await user.generateAuthToken();
    
    res.json({token, user})


}


module.exports.loginUser = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({message: "Inavalid credentails"});
    }

    const isPasswordValid = await user.comaprePassword(password)

    if(!isPasswordValid){
        return res.status(401).json({message: "wrong password"})
    }


    const token = await user.generateAuthToken();

    res.cookie('token', token);
    res.json({token, user});
}



module.exports.getUserProfile =async(req, res, next) => {
    res.json(req.user)
}

module.exports.logoutUser = async(req, res, next) => {
    res.clearCookie('token');  
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await BlackListToken.create({token})

    res.json({message : "Logout Successfully"})
}
