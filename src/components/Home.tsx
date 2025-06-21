import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState("");

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
      <Navbar />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar onSelectUser={setSelectedUser} selectedUser={selectedUser} />
        <div style={{ flex: 1, overflow: "hidden" }}>
          {selectedUser ? (
            <ChatWindow receiverId={selectedUser} />
          ) : (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#667781",
                fontSize: "1.1rem",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              Select a user to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
