const mapsService = require("../services/mapsService")
const {validationResult} = require("express-validator")

module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    
    const {address} = req.query;
    try{
        const coordinates = await mapsService.getAddressCordinate(address);
        res.status(200).json(coordinates);
    }
    catch(error){
        res.status(404).json({message: "Coordinates not found"})
    }
} 


module.exports.getDistanceTime = async(req, res, next) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        const {origin, destination} = req.query;

        const distanceTime = await mapsService.getDistanceTime(origin, destination)

        res.status(200).json(distanceTime)

    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"})
        
    }
}