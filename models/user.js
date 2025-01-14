const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minLength: [3, "First Name must be at least 3 characters long"],
        },
        lastname: {
            type: String,
            minLength: [3, "last Name must be at least 3 characters long"],
        },
    },

    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [4, "email must be at least 4 characters long"]
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    }
})





userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET)
    return token;
}





userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10)
}






userSchema.methods.comaprePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    return await bcrypt.compare(passwordInputByUser, passwordHash)
}





const User = mongoose.model("User", userSchema);

module.exports = User;