import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { ref, set } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to home if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "1rem",
        }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #f3f3f3",
            borderTop: "3px solid #008069",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}></div>
        <p style={{ color: "#667781", fontSize: "0.9rem" }}>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  const handleSignup = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isLoading) return;

    try {
      setError("");
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save user data to Realtime Database
      await set(ref(db, `users/${user.uid}`), {
        email: user.email,
        displayName: displayName || email.split("@")[0], // Use part of email if no display name
        createdAt: Date.now(),
      });

      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-background"></div>
      <div className="signup-container">
        <div className="auth-header">
          <h2 className="signup-title">Create Account</h2>
          <p className="auth-subtitle">Join FireChat and start connecting</p>
        </div>

        <form onSubmit={handleSignup} noValidate>
          {error && (
            <div className="error-message" role="alert">
              {error}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder="Display Name (Optional)"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              autoComplete="name"
              aria-label="Display Name"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              autoComplete="email"
              required
              aria-label="Email address"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input-field"
              autoComplete="new-password"
              required
              aria-label="Password"
            />
          </div>

          <button
            type="submit"
            className={`signup-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
            aria-label={isLoading ? "Creating account..." : "Create account"}>
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <div className="login-link-container">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
