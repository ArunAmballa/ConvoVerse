import express from "express"
import http from "http"
import {Server} from "socket.io"
import dotenv from "dotenv"


const app=express();
const server=http.createServer(app);

dotenv.config();

const PORT=process.env.PORT || 5000;

// webSocketServer is an instance of the Socket.IO server class that is associated with and attached to the HTTP server
const webSocketServer= new Server(server,{

    cors: {      // Allow WebSocket connections from different origins to the Socket.IO server by relaxing the browser's same-origin policy
        allowedHeaders: ["*"],
        origin: "*"
      }
} )

webSocketServer.on('connection',(socket)=>{
    console.log("Client Established Web Socket Connection");
    socket.on("chatMsg",(msg)=>{
        console.log("Message Received from Client",msg);
        socket.broadcast.emit("chatMsg",msg); // Send message to all connected clients
    })
})

// When a client connects to the Socket.IO server, 
//a unique socket object is created to represent that client's connection. 
//This socket object allows bidirectional communication between the server and the specific client that it represents.




app.get("/",(req,res)=>{
    res.json({message:"Welcome to Primary Server"})
})

webSocketServer.listen(PORT,(req,res)=>{
    console.log(`Server is Listening on Port ${PORT}`)
});

