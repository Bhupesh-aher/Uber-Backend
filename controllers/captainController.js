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






