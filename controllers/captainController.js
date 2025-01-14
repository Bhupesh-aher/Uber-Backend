const BlackListToken = require("../models/blackListToken");
const CaptainModel = require("../models/captain")
const captainService = require("../services/captainService")
const {validationResult} = require('express-validator')


module.exports.registerCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {fullname, email, password, vehicle} = req.body;

    const isCaptainAlreadyExists = await CaptainModel.findOne({email});

    if(isCaptainAlreadyExists){
        return res.status(400).json({message: "Captain Alreay Exist"});
    }

    const hashPassword = await CaptainModel.hashPassword(password)

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    })

    const token = await captain.genrateAuthToken();

    res.status(201).json({token, captain});
}



module.exports.logInCaptain = async(req, res, next) => {
    const erros = validationResult(req)
    if(!erros.isEmpty()){
        return res.status(400).json({errors: erros.array()});
    }

    const {email, password} = req.body;

    const captain = await CaptainModel.findOne({email}).select('+password');

    if(!captain){
        return res.status(400).json({message: "Invalid email or password"})
    }

    ispassowrdValid = await captain.comaprePassword(password)

    if(!ispassowrdValid){
        return res.status(401).json({message: "Invalid email or password"})
    }


    const token = await captain.genrateAuthToken();

    res.cookie('token', token);
    res.json({token, captain})
}


module.exports.getCaptainProfile = async(req, res, next) => {
    res.json({captain: req.captain})
}

module.exports.logOutCaptain = async(req, res, next) => {
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await BlackListToken.create({token})
    
    res.clearCookie('token');  

    res.json({message: "Logout Successfully"})

}