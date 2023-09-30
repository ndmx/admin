import React, { useState } from 'react';
import { db, storage } from '../firebase'; // Import storage along with db
import { doc, setDoc } from 'firebase/firestore';

const CreateUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [docId, setDocId] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleUpload = async () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log(error);
          reject(error);
        },
        async () => {
          const url = await storage.ref('images').child(image.name).getDownloadURL();
          setImageUrl(url);
          resolve(url);
        }
      );
    });
  };

  const createUser = async () => {
    try {
      if (image) {
        const uploadedImageUrl = await handleUpload();
        await setDoc(doc(db, 'users', docId), {
          username,
          email,
          password,
          imageUrl: uploadedImageUrl,
          mailbox: [],
          sentMessages: []
        });
      } else {
        await setDoc(doc(db, 'users', docId), {
          username,
          email,
          password,
          mailbox: [],
          sentMessages: []
        });
      }
      
      alert('User created successfully');
    } catch (error) {
      console.error("Error creating user: ", error);
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form>
        <input
          type="file"
          onChange={handleImageChange}
        />
        <input
          type="text"
          placeholder="Document ID"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" onClick={createUser}>Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
