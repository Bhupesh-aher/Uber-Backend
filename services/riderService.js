const Ride = require("../models/ride")
const mapsService = require("../services/mapsService")
const crypto = require("crypto")


async function getFare(pickup, destination) {
    if(!pickup || !destination){
        throw new Error('Pickup and destinatiom are required')
    }

    const distanceTime = await mapsService.getDistanceTime(pickup, destination)

    const baseFare = {
        auto: 30,
        car: 50,
        motorCycle: 20
    };

    const perKmRate = {
        auto: 10, 
        car: 15,
        motorCycle: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        motorCycle: 1.5
    }

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000 )* perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + (((distanceTime.duration.value) /60) * perMinuteRate.car)),
        motorCycle: Math.round(baseFare.motorCycle + ((distanceTime.distance.value / 1000) * perKmRate.motorCycle) + ((distanceTime.duration.value / 60)* perMinuteRate.motorCycle))
    }

    return fare;
}


module.exports.getFare = getFare;

function getOtp(num) {
    function genarateOtp(num) {
        const otp = crypto.randomInt(Math.pow(10, num -1), Math.pow(10, num)).toString();
        return otp;
    }

    return genarateOtp(num);
}


module.exports.createRide = async  ( {user, pickup, destination, vehicleType} ) => {
    if(!user || !pickup || !destination || !vehicleType){
        throw new Error("All fields are required")
    }

    const fare = await getFare(pickup, destination);
    

    const ride = Ride.create({
        user, 
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[vehicleType]
    })

    return ride
}





