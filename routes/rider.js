const express = require("express")
const rideRouter = express.Router();
const {body} = require('express-validator')
const rideController = require("../controllers/rideController")
const auth = require("../middlewares/auth")

rideRouter.post("/create",  
    auth.userAuth,
    body('pickup').isString().isLength({min:3}).withMessage("Invalid pickup address"),
    body('destination').isString().isLength({min:3}).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicleType'),

    rideController.createRide
)

module.exports = rideRouter