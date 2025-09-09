import { useEffect, useState, useRef } from "react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatId = [user?.uid, receiverId].sort().join("_");

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const getSenderName = (senderId: string) => {
    if (senderId === user?.uid) return "You";
    const sender = users[senderId];
    return (
      sender?.displayName || sender?.email?.split("@")[0] || "Unknown User"
    );
  };

  const getReceiverName = () => {
    const receiver = users[receiverId];
    return receiver?.displayName || receiver?.email?.split("@")[0] || "User";
  };

  const getReceiverInitial = () => {
    const receiver = users[receiverId];
    if (receiver?.displayName) {
      return receiver.displayName[0].toUpperCase();
    }
    if (receiver?.email) {
      return receiver.email[0].toUpperCase();
    }
    return "U";
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="chat-window">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="receiver-info">
          <div className="receiver-avatar">{getReceiverInitial()}</div>
          <div className="receiver-details">
            <div className="receiver-name">{getReceiverName()}</div>
            <div className="receiver-status">Online</div>
          </div>
        </div>
        <div className="chat-actions">
          <button className="action-btn" title="Call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
            </svg>
          </button>
          <button className="action-btn" title="Video call">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </button>
          <button className="action-btn" title="More options">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <div className="empty-messages-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="#667781"
                opacity="0.5">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.5c.2 0 .5-.1.7-.3L16.5 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <p>Start your conversation with {getReceiverName()}</p>
            <small>Send a message to begin chatting</small>
          </div>
        ) : (
          <>
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`message ${
                  m.senderId === user?.uid ? "sent" : "received"
                }`}>
                <div className="message-content">
                  <div className="message-sender">
                    {getSenderName(m.senderId)}
                  </div>
                  <div className="message-text">{m.message}</div>
                  <div className="message-time">
                    {formatTime(m.timestamp || Date.now())}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Container */}
      <div className="input-container">
        <div className="input-wrapper">
          <button className="attachment-btn" title="Attach file">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
            </svg>
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${getReceiverName()}...`}
            className="message-input"
            rows={1}
          />
          <button
            onClick={handleSend}
            className={`send-button ${input.trim() ? "active" : ""}`}
            disabled={!input.trim()}
            title="Send message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
