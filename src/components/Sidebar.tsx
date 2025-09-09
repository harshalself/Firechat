// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { listenToUsers } from "../firebase/userService";
import type { User } from "../firebase/userService";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

interface SidebarProps {
  onSelectUser: (uid: string) => void;
  selectedUser: string;
  isOpen?: boolean;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectUser,
  selectedUser,
  isOpen = true,
  isMobile = false,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    console.log("Setting up user listener..."); // Debug log
    const unsubscribe = listenToUsers((allUsers) => {
      console.log("Received users:", allUsers); // Debug log
      // Filter out the current user from the list
      const otherUsers = allUsers.filter(
        (user) => user.uid !== currentUser.uid
      );
      console.log("Filtered users:", otherUsers); // Debug log
      setUsers(otherUsers);
    });

    return () => {
      console.log("Cleaning up user listener..."); // Debug log
      unsubscribe();
    };
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <div
      className={`sidebar ${isMobile ? "sidebar-mobile" : ""} ${
        isOpen ? "sidebar-open" : "sidebar-closed"
      }`}>
      <div className="sidebar-header">
        <h3 className="sidebar-title">Chats</h3>
        <div className="online-count">
          {users.length} {users.length === 1 ? "contact" : "contacts"}
        </div>
      </div>
      <div className="sidebar-content">
        {users.length === 0 ? (
          <div className="no-users">
            <div className="no-users-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="#667781"
                opacity="0.5">
                <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A3.01 3.01 0 0 0 17.09 7h-1.18c-.89 0-1.67.57-1.97 1.37L11.4 16H9v2h2.5c.89 0 1.67-.57 1.97-1.37L15.1 11h.8l2.1 6.3v4.7H20zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 1h-2C3.57 7 2.46 7.89 2.05 9.12L0 16h2.5v6h4v-6H9l-2.05-6.88z" />
              </svg>
            </div>
            <p>No contacts available</p>
            <small>Invite friends to start chatting!</small>
          </div>
        ) : (
          <div className="users-list">
            {users.map((user) => (
              <div
                key={user.uid}
                onClick={() => onSelectUser(user.uid)}
                className={`user-item ${
                  selectedUser === user.uid ? "selected" : ""
                }`}>
                <div className="user-avatar">
                  {user.displayName?.[0] || user.email[0].toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">
                    {user.displayName || user.email.split("@")[0]}
                  </div>
                  <div className="user-email">{user.email}</div>
                </div>
                <div className="user-status">
                  <div className="status-indicator"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
