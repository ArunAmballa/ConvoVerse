"use client"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { useAuthStore } from "../zustand/useAuthStore";
import {useUserStore} from "../zustand/useUserStore";
import { useChatReceiverStore } from "../zustand/useChatReceiverStore";
import axios from "axios";
import ChatUserComponent from "../_components/ChatUserComponent";
import { useChatMsgsStore } from "../zustand/useChatMsgsStore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";




export default function Chat(){
    
    const [msg,setMsg]=useState("");
    const router=useRouter();
   // const [msgs,setMsgs]=useState([]);
    const [socket,setSocket]=useState();
    const {chatReceiver,updateChatReceiver}=useChatReceiverStore();
    const chatMsgs = useChatMsgsStore((state) => state.chatMsgs);
    const updateChatMsgs = useChatMsgsStore((state) => state.updateChatMsgs);
    const updateMsgs=useChatMsgsStore((state)=>state.updateMsgs)

   const {authName,updateAuthName}=useAuthStore();
   const {users,updateUsers}=useUserStore();



    useEffect(()=>{


        const getUserData=async()=>{

            try{

                const res=await axios.get("http://localhost:8081/users",//`${process.env.NEXT_PUBLIC_BE_HOST}:8081/users`,
                {
                    withCredentials:true
                })
                console.log("userData ",res.data.users)
                console.log("check",res.data)
                updateUsers(res.data.users)
                updateAuthName(res.data.username);

                        //Establish Web Connection 
                const newSocket=io("http://localhost:8080",//`${process.env.NEXT_PUBLIC_BE_HOST}:8080`,
                {
                    query:{
                        username:res.data.username
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

                return ()=>{
                    newSocket.close();
                }


            }catch(e){
                console.log("Error occured While fetching Users",e)
            }
        }

        getUserData();


        

       
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

    const clearAllCookies = () => {
        console.log("This is called");
        const cookies = Cookies.get(); // Get all cookies
        console.log("All Cookies",cookies)
        Object.keys(cookies).forEach(cookieName => {
            Cookies.remove(cookieName); // Remove each cookie by name
        });
    };

    const logOut=()=>{

        clearAllCookies();
        router.push("/")
    }

    // JSON.stringify(chatMsgs)

    return (

       
        <div className="flex flex-col">

            <div className="bg-gray-900 flex flex-row-reverse h-12">

                    <button onClick={logOut} className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg ">
                                Logout
                    </button>

            </div>


            <div className="h-screen flex divide-x-4 ">

                    <div className="w-1/5 bg-gray-900">
                        <ChatUserComponent></ChatUserComponent>
                    </div>
                    <div className='flex flex-col w-4/5 bg-gray-900'>
                <h1 className="text-white">{authName} is chatting with {chatReceiver}</h1>
            <div className='msgs-container h-4/5 overflow-scroll'>
                {chatMsgs.length>0 && chatMsgs.map((msg, index) => (
                    <div key={index} className={` m-10 ${msg.sender === authName ? 'text-right' : 'text-left'}`}>
                        <span className={`${msg.sender === authName ? 'bg-gray-700' : 'bg-gray-700'} p-3 rounded-lg shadow-xl text-slate-200 w-4 h-3 font-serif font-medium`}>
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

                        <div>
                    </div>
                    </div>
                </form>
            </div>
                    </div>

            </div>

           

        </div>
   

    )
}