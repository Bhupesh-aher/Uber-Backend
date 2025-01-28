const socketIo = require('socket.io')
const User = require('./models/user')
const CaptainModel = require("./models/captain")

let io;

function initializeSocket (server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async(data) => {
            const {userId, userType} = data;

            // console.log(`User ${userId} joined as ${userType}`);
            

            if(userType === 'user') {
                await User.findByIdAndUpdate(userId, {socketId: socket.id})

                } else if(userType === 'captain') {
                    await CaptainModel.findByIdAndUpdate(userId, { socketId: socket.id });     
                }
            }) 

            socket.on('update-location-captain', async (data) => {
                const { userId, location } = data;

                if (!location || !location.ltd || !location.lng) {
                    return socket.emit('error', { message: 'Invalid location data' });
                }

                await CaptainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
            })
            
            socket.on('disconnect', () => {
                console.log(`Client disconected: ${socket.id}`);
            })
                   
        })
    }



function sendMessageToSocketId(socketId, messageObject) {
    console.log(`Sending message to ${socketId}`, messageObject);
    
    if(io){
        io.to(socketId).emit( messageObject.event, messageObject.data);
    }
    else{
        console.log('Socket.io not initialized');
        
    }
}

module.exports = {initializeSocket, sendMessageToSocketId}