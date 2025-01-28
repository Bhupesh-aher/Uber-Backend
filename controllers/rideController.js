const rideService = require("../services/riderService")
const {validationResult} = require("express-validator")
const mapsService = require("../services/mapsService")
const {sendMessageToSocketId} = require("../socket")
const Ride = require("../models/ride")

module.exports.createRide = async(req, res) => {
    const erros = validationResult(req);
    if(!erros.isEmpty()){
        return res.status(400).json({erros: erros.array()});
    }

   const {pickup, destination, vehicleType} = req.body;

   try{
        const ride = await rideService.createRide({user: req.user._id, pickup, destination, vehicleType})
       
        res.status(201).json(ride)

        const pickupCoordinates = await mapsService.getAddressCordinate(pickup)
     //    console.log(pickupCoordinates);
        

        const captainsInRadius = await mapsService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 10);
     //    console.log(captainsInRadius);
        

        ride.otp = "";
          
        const rideWithUser = await Ride.findOne({ _id: ride._id }).populate('user')
     //    console.log(rideWithUser);
        
        
       captainsInRadius.map(captain => {

          // console.log(captain, ride);
          
          sendMessageToSocketId(captain.socketId, {
               event: "new-ride",
               data: rideWithUser
          }) 
       })
        
        
   }

   catch(err){
        return res.status(500).json({message: err.message})
   }
}


module.exports.getFare = async(req, res) => {
     const erros = validationResult(req);
     if(!erros.isEmpty()){
          return res.status(400).json({erros: erros.array()});
     }

     const {pickUp, destination} = req.query;
     const pickup = pickUp;

     try{
          const fare = await rideService.getFare( pickup, destination )
          
          return res.status(201).json(fare)
     }

     catch(err){
          return res.status(500).json({message: err.message})
     }
}


module.exports.confirmRide = async(req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()){
          return res.status(400).json({errors: errors.array()})
     }

     const {rideId} = req.body;

     try{
          const ride = await rideService.confirmRide({rideId, captain: req.captain})
          sendMessageToSocketId(ride.user.socketId, {
               event: 'ride-confirmed',
               data: ride
          })
          return res.status(200).json(ride)
     }
     catch(err){
          return res.status(500).json({message: err.message})
     }
}