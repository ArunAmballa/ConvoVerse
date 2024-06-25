import Conversation from "../models/chat.model.js";

const getMsgsForConversation = async (req, res) => {
    try {
        const { sender, receiver } = req.query;
        console.log(sender + receiver);
        const participants = [sender, receiver];
        // Find conversation by participants
        const conversation = await Conversation.findOne({ users: { $all: participants } });
        if (!conversation) {
            console.log('Conversation not found');
            return res.status(200).send({msgs:[]});
        }
        
        return res.json({msgs:conversation.msgs});
    } catch (error) {
        console.log('Error fetching messages:', error);
        res.status(500).json({ error: 'Server error' });
    }
 };
 export default getMsgsForConversation;