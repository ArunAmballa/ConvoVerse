import Conversation from "../models/chat.model.js";

 const addMsgToConversation=async(participants,msg)=>{

    try{

        let conversation=await Conversation.findOne({users:{ $all: participants }});
        if(!conversation){
            conversation=await Conversation.create(({users:participants}))
        }
        conversation.msgs.push(msg);
        await conversation.save();

    }catch(error){
        console.log("Something went wrong while adding Messages",error)
        
    }
 }

 export default addMsgToConversation;
