import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import "./Home.css";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Close sidebar when user is selected on mobile
  const handleSelectUser = (uid: string) => {
    setSelectedUser(uid);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="home-container">
      <Navbar onToggleSidebar={toggleSidebar} showSidebarToggle={isMobile} />
      <div className="main-layout">
        {/* Mobile overlay */}
        {isMobile && (
          <div
            className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
            onClick={closeSidebar}
          />
        )}

        <Sidebar
          onSelectUser={handleSelectUser}
          selectedUser={selectedUser}
          isOpen={isSidebarOpen}
          isMobile={isMobile}
        />

        <div className="chat-container">
          {selectedUser ? (
            <ChatWindow receiverId={selectedUser} />
          ) : (
            <div className="empty-chat">
              <div className="empty-chat-content">
                <div className="empty-chat-icon">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="#667781">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1h.5c.2 0 .5-.1.7-.3L16.5 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H16l-4 4V16H4V4h16v12z" />
                  </svg>
                </div>
                <h3>Welcome to FireChat</h3>
                <p>Select a user from the sidebar to start chatting</p>
                {isMobile && (
                  <button className="open-sidebar-btn" onClick={toggleSidebar}>
                    View Contacts
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
