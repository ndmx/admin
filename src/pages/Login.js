import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const q = query(collection(db, "users"), where("username", "==", username), where("password", "==", password));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Invalid username or password");
      }

      const userId = querySnapshot.docs[0].id;

      // Storing userId in localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("userId", userId);
      }

      props.onLoginStatusChange(true, userId); // Notify App.js that the user has logged in, also pass userId

      setUsername("");
      setPassword("");
      setRememberMe(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="loginPage">
      <div className="loginForm">
        <div className="container">
          <form className="form" onSubmit={handleLogin}>
            <h1>Admin Access</h1>
            <div className="txtb">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="txtb">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <label htmlFor="remember-me">Remember Me</label>
              <input
                type="checkbox"
                id="remember-me"
                name="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            </div>
            <div className="input-container">
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </button>
            </div>
            <div className="input-container">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
