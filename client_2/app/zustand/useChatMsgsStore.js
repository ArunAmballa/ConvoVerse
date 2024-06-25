import {create} from 'zustand';


export const useChatMsgsStore = create((set) => ({
   chatMsgs:[],
   updateChatMsgs: (chatMsgs) => set({chatMsgs}),
   updateMsgs: (newMsg) => set((state) => ({
      chatMsgs: [...state.chatMsgs, newMsg]
  }))
}));


// import { create } from 'zustand';

// export const useChatMsgsStore = create((set) => ({
//     chatMsgs: [],
//     updateChatMsgs: (newMsg) => set((state) => ({ chatMsgs: [...state.chatMsgs, newMsg] }))
// }));

// import {create} from "zustand";

// export const useUserStore = create((set) => ({
//     users:[],
//     updateUsers: (users) => set({users: users})
//  }))
 