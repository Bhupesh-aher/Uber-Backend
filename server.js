const http = require("http")
const app = require("./app")
const port = process.env.PORT || 3000;
const connectDB = require("./db/database");

const server = http.createServer(app);


connectDB().then(() => {
    console.log("database connected successfully");
    server.listen(port, () => {
        console.log(`server is successfully listening on PORT ${port}...`);
        
    })
    
})
.catch(() => {
    console.log("Database cannot be connected");
    
})
