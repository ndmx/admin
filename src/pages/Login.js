import React, { useState } from 'react';
import { usersDatabase } from '../utils/mockDatabase';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const user = usersDatabase.find(
        (user) => user.username === username && user.password === password
      );
  
      if (!user) {
        throw new Error('Invalid username or password');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      props.onLoginStatusChange(true, user.id); // Notify App.js that the user has logged in

      setUsername('');
      setPassword('');
      setRememberMe(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="loginForm">
        <div className="container">
          <form onSubmit={handleLogin}>
            <div className="input-container">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="input-container">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="input-container">
              <label htmlFor="remember-me">Remember Me</label>
              <input type="checkbox" id="remember-me" name="remember-me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            </div>
            <div className="input-container">
              <a href="/forgot-password">Forgot Password?</a>
            </div>
            <div className="input-container">
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Login'}
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
