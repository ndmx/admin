import React from 'react';
import Mail from '../utils/Mail';
import { usersDatabase } from '../utils/mockDatabase';

const imageContext = require.context('../utils/database-img', true, /\.(jpg)$/);
const Home = ({ userId }) => {
  // Get Time
  const getUTCTime = () => {
    const now = new Date();
    const utcTime = now.toUTCString();
    return utcTime;
  };
  // Find the user with the given ID in the mock database
  const user = usersDatabase.find((user) => user.id === userId);
  // Dynamic image import using require
  const userProfileImage = imageContext(`./${user.image}`);

  return (
    <div id="homePage">
      <div className="userinfo">
        <h1>Welcome, Admin!</h1>
      </div>
      <div className="homepage-container">
        <div className="left-section">
          <div className="user-info">
            {/* Fetch image from the mock database */}
            <img src={userProfileImage} alt="User" />
            <div className="username">{user.username}</div>
            <div className="email">{user.email}</div>
          </div>
          <div className="login-time">
            Logged in at: <span>{getUTCTime()}</span>
          </div>
        </div>

        <div className="right-section">
          <div className="details-box">
            <div className="message">{user.message}</div>
          </div>
          <Mail />
          <div className="mailbox">
            <h2>Your Mailbox:</h2>
            <ul>
              {user.mailbox.map((email, index) => (
                <li key={index}>
                  <div>Name: {email.fromName}</div>
                  <div>Email: {email.fromEmail}</div>
                  <div>Message: {email.message}</div>
                  <div>Timestamp: {email.timestamp}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
