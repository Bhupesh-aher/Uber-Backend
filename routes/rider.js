const express = require("express")
const rideRouter = express.Router();
const {body, query} = require('express-validator')
const rideController = require("../controllers/rideController")
const auth = require("../middlewares/auth")

rideRouter.post("/create",  
    auth.userAuth,
    body('pickup').isString().isLength({min:3}).withMessage("Invalid pickup address"),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicleType'),

    rideController.createRide
)

rideRouter.get('/get-fare', 
    auth.userAuth, 
    query('pickUp').isString().isLength({min: 3}).withMessage("Invalid pickup address"),
    query('destination').isString().isLength({min: 3}).withMessage("Invalid destination address"),
    rideController.getFare)



rideRouter.post('/confirm', auth.captainAuth,

    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.confirmRide
)

rideRouter.get('/start-ride', 
    auth.captainAuth,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({min:6, max:6}).withMessage('Invalid otp'),
    rideController.startRide
)

rideRouter.post('/end-ride', 
    auth.captainAuth,
    body('rideId').isMongoId().withMessage("Invalid Ride id"),
    rideController.endRide
)



module.exports = rideRouter