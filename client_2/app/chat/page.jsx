"use client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuthStore } from "../zustand/useAuthStore";
import {useUserStore} from "../zustand/useUserStore";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import axios from "axios";
import ChatUserComponent from "../_components/ChatUserComponent";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";



export default function Chat(){
    
    const [msg,setMsg]=useState("");
   // const [msgs,setMsgs]=useState([]);
    const [socket,setSocket]=useState();
    const {chatReceiver,updateChatReceiver}=useChatReceiverStore();
    const chatMsgs = useChatMsgsStore((state) => state.chatMsgs);
    const updateChatMsgs = useChatMsgsStore((state) => state.updateChatMsgs);
    const updateMsgs=useChatMsgsStore((state)=>state.updateMsgs)

   const {authName,updateAuthName}=useAuthStore();
   const {users,updateUsers}=useUserStore();



    useEffect(()=>{

        console.log("Username from store",authName)
        //Establish Web Connection 
        const newSocket=io(`${process.env.NEXT_PUBLIC_BE_HOST}:8082`,
        {
            query:{
                username:authName
            }
        })
        setSocket(newSocket)

        //Listening for Incoming Messages
        newSocket.on("chatMsg",(msg)=>{
            
            console.log("chat Messages array",JSON.stringify(chatMsgs))
            console.log("Message Received on Client Side",msg);
            
            //setMsgs(prevMsg => [...prevMsg,{text:msg.text,sentByCurrUser: false }])
            // updateChatMsgs([...chatMsgs,msg])
            updateMsgs(msg)
        })

        const getUserData=async()=>{
            try{
                const res=await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8081/users`,
                {
                    withCredentials:true
                })
                console.log("userData ",res.data.users)
                console.log("check",res.data)
                updateUsers(res.data.users)
              

            }catch(e){
                console.log("Error occured While fetching Users",e)
            }
        }

        getUserData();



        return ()=>{
            newSocket.close();
        }
    },[])

    const sendMsg=(e)=>{
        e.preventDefault();
        const msgToSent={
            text:msg,
            sender:authName,
            receiver:chatReceiver
        }
        if(socket){
            socket.emit("chatMsg",msgToSent);
            // updateChatMsgs([...chatMsgs,msgToSent])
            updateMsgs(msgToSent);
            console.log("chat Messages array",JSON.stringify(chatMsgs))
            //setMsgs(prevMsg => [...prevMsg,{text:msg,sentByCurrUser: true }])
            setMsg(" ");
        }
        else
        {
            console.log("No Socket Connection is found to send Message");
        }
    }

    // JSON.stringify(chatMsgs)

    return (

       
        <div className="h-screen flex divide-x-4 ">

            <div className="w-1/5 bg-blue-500">
                <ChatUserComponent></ChatUserComponent>
            </div>

            <div className='flex flex-col w-4/5 bg-red-500'>
        <h1>{authName} is chatting with {chatReceiver}</h1>
      <div className='msgs-container h-4/5 overflow-scroll'>
          {chatMsgs.length>0 && chatMsgs.map((msg, index) => (
              <div key={index} className={` m-10 ${msg.sender === authName ? 'text-right' : 'text-left'}`}>
                  <span className={`${msg.sender === authName ? 'bg-violet-400' : 'bg-green-300'} p-3 rounded-full text-black`}>
                       {msg.text}
                   </span>
              </div>
          ))}
      </div>
      <div className='h-1/5 flex items-center justify-center'>
          <form onSubmit={sendMsg} className="w-1/2"> 
              <div className="relative"> 
                  <input type="text"
                          value={msg}
                          onChange={(e) => setMsg(e.target.value)}
                          placeholder="Type your message here"
                          required
                          className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
                  <button type="submit"
                          className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                          Send
                  </button>
              </div>
          </form>
      </div>
  </div>

        </div>
   

    )
}