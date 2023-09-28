import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

const Mail = () => {
  const [contactForms, setContactForms] = useState([]);
  const [joinForms, setJoinForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from contactForms collection
        console.log('DB Object:', db);
        const contactSnapshot = await db.collection('contactForms').get();
        const contactData = contactSnapshot.docs.map((doc) => doc.data());
        setContactForms(contactData);

        // Fetch data from joinForms collection
        const joinSnapshot = await db.collection('joinForms').get();
        const joinData = joinSnapshot.docs.map((doc) => doc.data());
        setJoinForms(joinData);
      } catch (error) {
        console.log('Error fetching data:', error);  // Log the entire error object
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      <h1>Contact Forms</h1>
      <ul>
        {Array.isArray(contactForms) && contactForms.map((form, index) => (
          <li key={index}>
            Name: {form.name} <br />
            Email: {form.email} <br />
            Message: {form.message}
          </li>
        ))}
      </ul>

      <h1>Join Forms</h1>
      <ul>
        {Array.isArray(joinForms) && joinForms.map((form, index) => (
          <li key={index}>
            Name: {form.name} <br />
            Email: {form.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Mail;
