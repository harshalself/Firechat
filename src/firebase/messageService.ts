import { db } from "./firebase";
import { ref, push, onValue } from "firebase/database";
import type { Message } from "../types";

// Send message to Firebase Realtime DB
export const sendMessage = async (chatId: string, msg: Omit<Message, "timestamp">) => {
  const msgRef = ref(db, `messages/${chatId}`);
  await push(msgRef, { ...msg, timestamp: Date.now() });
};

// Listen to messages from Firebase Realtime DB
export const listenToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
) => {
  const msgRef = ref(db, `messages/${chatId}`);
  onValue(msgRef, (snapshot) => {
    const data = snapshot.val();
    const messages = data ? (Object.values(data) as Message[]) : [];
    callback(messages);
  });
};
