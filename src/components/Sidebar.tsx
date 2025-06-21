// src/components/Sidebar.tsx
import React, { useEffect, useState } from "react";
import { listenToUsers } from "../firebase/userService";
import type { User } from "../firebase/userService";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

interface SidebarProps {
  onSelectUser: (uid: string) => void;
  selectedUser: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectUser, selectedUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    console.log("Setting up user listener..."); // Debug log
    const unsubscribe = listenToUsers((allUsers) => {
      console.log("Received users:", allUsers); // Debug log
      // Filter out the current user from the list
      const otherUsers = allUsers.filter(user => user.uid !== currentUser.uid);
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
    <div className="sidebar">
      <div className="sidebar-header">
        <h3 className="sidebar-title">Chats</h3>
      </div>
      <div className="sidebar-content">
        {users.length === 0 ? (
          <div className="no-users">
            No users available
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.uid}
              onClick={() => onSelectUser(user.uid)}
              className={`user-item ${selectedUser === user.uid ? 'selected' : ''}`}
            >
              <div className="user-avatar">
                {user.displayName?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="user-info">
                <div className="user-name">
                  {user.displayName || user.email.split('@')[0]}
                </div>
                <div className="user-email">
                  {user.email}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
