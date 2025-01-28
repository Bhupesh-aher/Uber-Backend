const axios = require('axios')
const CaptainModel = require("../models/captain")

module.exports.getAddressCordinate = async (address) => {
    const apikey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apikey}`;
                
    try{
        const response = await axios.get(url);
        if(response.data.status === 'OK'){
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            }
        }
            else{
                throw new Error('Unable to fetch coordinates');
            }
    }
    catch(error){
        console.log(error)
        throw error;
    }
}


module.exports.getDistanceTime = async(origin, destination) => {
    if(!origin || !destination){
        throw new Error("Origin and destimation are required")   
    }
    const apikey = process.env.GOOGLE_MAPS_API;
 
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?destinations=${encodeURIComponent(destination)}&origins=${encodeURIComponent(origin)}&key=${apikey}`

    try{
        const response = await axios.get(url);
        if(response.data.status === "OK"){
            if(response.data.rows[0].elements[0].status === "ZERO_RESULTS"){
                throw new Error("No routes found")
            }

            return response.data.rows[0].elements[0]
        }
        else{
            throw new Error('Unable to fetch distance and time')
        }
    }
    catch(error){
        console.log(err);
        throw err;
        
    }
}

module.exports.getAutoCompleteSuggestions = async(input) => {
    if(!input){
        throw new Error('Query is required')
    }

    const apikey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apikey}`

    try{
        const response = await axios.get(url)
        if(response.data.status === "OK"){
            return response.data.predictions;
        }
        else{
            throw new Error("Unable to fetch suggestions")
        }
    }
    catch(err){
        console.log(err);
        throw err;
        
    }
}


module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    
    const captains = await CaptainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });
    
     

    return captains;


}