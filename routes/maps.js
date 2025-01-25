const express = require('express')
const mapsRouter = express.Router();
const mapController = require("../controllers/mapController")
const auth = require("../middlewares/auth")
const {query} = require('express-validator');

mapsRouter.get("/get-coordinates", 
    query('address').isString().isLength({min: 3}),
    auth.userAuth, 
    mapController.getCoordinates
)

mapsRouter.get("/get-distance-time",
    query("origin").isString().isLength({min: 3}),
    query('destination').isString().isLength({min: 3}),
    auth.userAuth,
    mapController.getDistanceTime


 )

module.exports = mapsRouter;