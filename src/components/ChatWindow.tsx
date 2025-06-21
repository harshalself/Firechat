import { useEffect, useState } from "react";
import { sendMessage, listenToMessages } from "../firebase/messageService";
import type { Message } from "../types";
import { useAuth } from "../context/AuthContext";
import { listenToUsers } from "../firebase/userService";
import type { User } from "../firebase/userService";
import "./ChatWindow.css";

interface ChatWindowProps {
  receiverId: string;
}

const ChatWindow = ({ receiverId }: ChatWindowProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [users, setUsers] = useState<Record<string, User>>({});
  const { user } = useAuth();

  const chatId = [user?.uid, receiverId].sort().join("_");

  // Listen to messages
  useEffect(() => {
    listenToMessages(chatId, (msgs) => setMessages(msgs));
  }, [chatId]);

  // Listen to users to get their names
  useEffect(() => {
    const unsubscribe = listenToUsers((allUsers) => {
      const usersMap = allUsers.reduce((acc, user) => {
        acc[user.uid] = user;
        return acc;
      }, {} as Record<string, User>);
      setUsers(usersMap);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async () => {
    if (input.trim() && user) {
      await sendMessage(chatId, {
        senderId: user.uid,
        receiverId,
        message: input.trim(),
      });
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.uid) return "You";
    const sender = users[senderId];
    return (
      sender?.displayName || sender?.email?.split("@")[0] || "Unknown User"
    );
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`message ${
              m.senderId === user?.uid ? "sent" : "received"
            }`}>
            <div className="message-sender">{getSenderName(m.senderId)}</div>
            {m.message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="message-input"
          rows={1}
        />
        <button
          onClick={handleSend}
          className="send-button"
          disabled={!input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
