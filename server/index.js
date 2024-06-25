import express from "express"
import http from "http"
import {Server} from "socket.io"
import dotenv from "dotenv"
import connectDB from "./db/database.js"
import addMsgToConversation from "./controllers/msgs.controller.js"
import router from "./routes/route.js"
import cors from "cors";
import { subscribe } from "./redis/msgsPubSub.js"
import { publish } from "./redis/msgsPubSub.js"


const app=express();
app.use(cors());



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



const userSocketMap={}

webSocketServer.on('connection',(socket)=>{
    console.log("Client Established Web Socket Connection");
    const username = socket.handshake.query.username;
    userSocketMap[username]=socket;

    console.log("Username from socket connection",username)

    const channelName = `chat_${username}`
    subscribe(channelName, (msg) => {
    socket.emit("chatMsg", JSON.parse(msg));
    });

    
    socket.on("chatMsg",(msg)=>{
        console.log("Message Received from Client",msg);
        const receiverSocket=userSocketMap[msg.receiver]
        
        if(receiverSocket){
            //Both sender and receiver are connected to same backends 
            receiverSocket.emit("chatMsg",msg)
        }
         else{
            //sender and receiver are connected to different backends  so we need to use publish to redis
            const channelName = `chat_${msg.receiver}`
            publish(channelName, JSON.stringify(msg));
        }

        addMsgToConversation([msg.sender, msg.receiver], {
            text: msg.text,
            sender:msg.sender,
            receiver:msg.receiver
          }
  )
        //socket.broadcast.emit("chatMsg",msg); // Send message to all connected clients
    })
})

// When a client connects to the Socket.IO server, 
//a unique socket object is created to represent that client's connection. 
//This socket object allows bidirectional communication between the server and the specific client that it represents.


app.use('/msgs',router);
app.get("/",(req,res)=>{
    res.json({message:"Welcome to Primary Server"})
})

server.listen(PORT,(req,res)=>{
    connectDB()
    console.log(`Server is Listening on Port ${PORT}`)
});

