const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true, 
            minLenght: [3, "First Name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minLenght: [3, "First Name must be at least 3 characters long"],
        }
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: [3, "email must be at least 3 characters long"]
    },
    password: {
        type: String, 
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive"
    },
    vehicle: {
        color: {
            type: String,
            required: true, 
            minLength: [3, "color must be at least 3 characters long"]
        },
        plate: {
            type: String,
            required: true, 
            minLenght: [3, "plate number must be at least 3 characters long"]
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1"]
        },
        vehicleType: {
            type: String,
            required: true,
            enum:["car", "motorcycle", "auto"]
        }

    },

    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})


captainSchema.methods.genrateAuthToken = async function() {
    const captain = this;
    const token = await jwt.sign({_id: captain._id}, process.env.JWT_SECRET, {expiresIn: '24h'})
    return token;
}

captainSchema.methods.comaprePassword = async function (passwordInputByCaptain) {
    const captain = this;
    const hashPasswod = captain.password;
    return await bcrypt.compare(passwordInputByCaptain, hashPasswod)
}

captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10)
}


const CaptainModel =  mongoose.model("CaptainModel", captainSchema);

module.exports = CaptainModel;