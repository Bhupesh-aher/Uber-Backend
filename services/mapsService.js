const axios = require('axios')

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