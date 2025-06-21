import { useState } from "react";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ref, set } from "firebase/database";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError("");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data to Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        displayName: displayName || email.split('@')[0], // Use part of email if no display name
        createdAt: Date.now()
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Create Account</h2>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <input 
        placeholder="Display Name" 
        value={displayName} 
        onChange={(e) => setDisplayName(e.target.value)}
        className="input-field"
      />
      <input 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input 
        placeholder="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button 
        onClick={handleSignup}
        className="signup-button"
      >
        Sign Up
      </button>

      <div className="login-link-container">
        Already have an account?{" "}
        <Link 
          to="/login"
          className="login-link"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
