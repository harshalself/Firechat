// src/components/Navbar.tsx
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

interface NavbarProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

const Navbar = ({
  onToggleSidebar,
  showSidebarToggle = false,
}: NavbarProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const getUserInitial = () => {
    if (user?.displayName) {
      return user.displayName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showSidebarToggle && (
          <button
            className="sidebar-toggle"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </button>
        )}
        <div className="navbar-brand">
          <span className="brand-full">Realtime Chat App by Harshal</span>
          <span className="brand-short">FireChat</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="user-info">
          <div className="user-avatar">{getUserInitial()}</div>
          {/* Removed user-name display completely to hide email */}
        </div>
        <button onClick={handleLogout} className="logout-button">
          <span className="logout-text">Logout</span>
          <span className="logout-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
