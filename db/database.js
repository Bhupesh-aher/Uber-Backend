const mongoose = require("mongoose")

const connectDB = async() => {
    await mongoose.connect(process.env.DB_CONNECT)
}

module.exports = connectDB