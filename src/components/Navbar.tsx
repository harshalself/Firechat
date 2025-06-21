// src/components/Navbar.tsx
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const getUserName = () => {
    if (user?.displayName) {
      return user.displayName.toUpperCase();
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
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
      <div className="navbar-brand">Realtime Chat App by Harshal</div>
      <div className="navbar-right">
        <div className="user-avatar">{getUserInitial()}</div>
        <div className="user-name">{getUserName()}</div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
