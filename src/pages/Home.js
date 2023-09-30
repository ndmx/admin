import React, { useState, useEffect } from "react";
import { sendMessage, getUser } from "../utils/mockDatabase";
import { useCookieConsent } from "../utils/cookies";
import Mail from "../utils/Mail";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';


const Home = ({ userId }) => {
  useCookieConsent();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUser(userData);
      } else {
        console.error("No such user!");
      }
    };

    fetchData();
  }, [userId]);

  const [activeTab, setActiveTab] = useState("contact");
  const [newMessage, setNewMessage] = useState("");
  const [receiverId, setReceiverId] = useState("");

  const handleSendMessage = async () => {
    if (!user) return;

    const messageObj = {
      fromName: user.username,
      fromEmail: user.email,
      message: newMessage,
      timestamp: Timestamp.fromDate(new Date()),  // Firestore's Timestamp
    };

    if (await sendMessage(userId, receiverId, messageObj)) {
      const refreshedUser = await getUser(userId);
      setUser(refreshedUser);

      setNewMessage("");
      setReceiverId("");
    } else {
      console.error("Failed to send the message. User IDs might be incorrect.");
    }
  };

  const getUTCTime = () => {
    const now = new Date();
    const utcTime = now.toUTCString();
    return utcTime;
  };

  return (
    <div id="homePage">
      <div className="homepage-container">
        <div className="left-section">
          <div className="user-info">
            <div className="username">
              {user ? user.username : "Loading..."}
            </div>
            <div className="email">{user ? user.email : "Loading..."}</div>
          </div>
          <div className="login-time">
            Logged in at: <span>{getUTCTime()}</span>
          </div>
        </div>

        <div className="right-section">
          <div className="tabs">
            <div
              className={`tab ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              Contact Forms
            </div>
            <div
              className={`tab ${activeTab === "join" ? "active" : ""}`}
              onClick={() => setActiveTab("join")}
            >
              Join Forms
            </div>
            <div
              className={`tab ${activeTab === "third" ? "active" : ""}`}
              onClick={() => setActiveTab("third")}
            >
              User Mailbox
            </div>
          </div>
          <Mail activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "third" && user && (
            <div className="mailbox">
              <ul>
                {user.mailbox && user.mailbox.length > 0 ? (
                  user.mailbox.map((email, index) => (
                    <li key={index}>
                      From: {email.fromName} --|-- {email.timestamp ? format(new Date(email.timestamp), 'h:mm a, MMM d yyyy') : 'N/A'}<br />
                      Email: {email.fromEmail} <br />
                      Message: {email.message}
                    </li>
                  ))
                ) : (
                  <li>No emails in the mailbox.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="send-message-form">
        <input
          id="userID"
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <textarea
          id="mailMessage"
          placeholder="New message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Home;
