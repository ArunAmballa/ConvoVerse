"use client"
import {useUserStore} from "../zustand/useUserStore";
import {useChatReceiverStore} from "../zustand/useChatReceiverStore";
import {useChatMsgsStore} from "../zustand/useChatMsgsStore";
import { useAuthStore } from "../zustand/useAuthStore";
import { useEffect } from "react";
import axios from "axios";

export default function ChatUserComponent(){

    const {users}=useUserStore();
    const {chatReceiver,updateChatReceiver}=useChatReceiverStore();
    const chatMsgs = useChatMsgsStore((state) => state.chatMsgs);
    const updateChatMsgs = useChatMsgsStore((state) => state.updateChatMsgs);
    const {authName,updateAuthName}=useAuthStore();

    useEffect(() => {

        const getMsgs = async () => {
            const response = await axios.get("http://localhost:8082/msgs",//`${process.env.NEXT_PUBLIC_BE_HOST}:8080/msgs`,
                {
                    params: {
                        'sender': authName,
                        'receiver': chatReceiver
                    }
                },
                {
                    withCredentials: true
                });
            console.log("Response",response)
            if (response.data.msgs.length !== 0) {
                console.log("Updating Chat Msgs")
                updateChatMsgs(response.data.msgs);
                
            }else{
                updateChatMsgs([]);
            }
        }
        if(chatReceiver) {
            getMsgs();
        }
    }, [chatReceiver])
 

    
    return (
        <div>

            {

                users.length>0 && users.map((user,index)=>(
                
                        <div key={index} onClick={()=>updateChatReceiver(user.username)} className='bg-slate-400 h-10  font-serif font-medium  rounded-lg text-left px-7 '>
                            {user.username}
                            </div>
                   
             
                ))

            }

        </div>
    )
}