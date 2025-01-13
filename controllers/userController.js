const User = require("../models/user");
const userService = require("../services/userService")
const {validationResult} = require("express-validator")

module.exports.registerUser = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.staus(400).json({errors: errors.array()})
    }

    const {fullname, email, password} = req.body;

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