const express = require('express')
const captainRoutes = express.Router();
const {body} = require("express-validator")
const captainController = require("../controllers/captainController")

captainRoutes.post("/register", [
    body('email').isEmail().withMessage("Inavlid Email"),
    body('fullname.firstname').isLength({min: 3}).withMessage("First Name must be at least 3 characters long"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
    body('vehicle.color').isLength({min: 3}).withMessage("Color must be at least 3 characters long"),
    body('vehicle.plate').isLength({min: 3}).withMessage("Plate must be at least 3 characters long"),
    body('vehicle.capacity').isLength({min: 1}).withMessage("Capacity must be at least 1"),
    body('vehicle.vehicleType').isIn(["car", "motorcycle", "auto"]).withMessage("Invalid vehicle type")
], 
    captainController.registerCaptain
)

module.exports = captainRoutes;