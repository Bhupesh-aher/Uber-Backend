const dotenv = require("dotenv")
dotenv.config();
const express = require("express")
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser")
const userRoutes = require("./routes/user")
const captainRoutes = require("./routes/captain")
const mapsRouter = require("./routes/maps")


app.use(cors());
app.use(express.json())
// app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello")
})

app.use("/users", userRoutes)
app.use("/captains", captainRoutes)
app.use("/maps", mapsRouter)

module.exports = app;