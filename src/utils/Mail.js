import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

const Mail = ({ activeTab, setActiveTab }) => {
  const [contactForms, setContactForms] = useState([]);
  const [joinForms, setJoinForms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all documents from contactForms collection
        const contactSnapshot = await getDocs(collection(db, 'contactForms'));
        const contactData = contactSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        setContactForms(contactData);

        // Fetch all documents from joinForms collection
        const joinSnapshot = await getDocs(collection(db, 'joinForms'));
        const joinData = joinSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        setJoinForms(joinData);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {activeTab === 'contact' && (
        <div className="mailbox">
          <ul>
            {contactForms.map((form, index) => (
              <li key={index}>
                Name: {form.name} --|-- {form.timestamp ? format(form.timestamp.toDate(), 'h aaaa, MMM d yyyy') : 'N/A'}<br />
                Email: {form.email}  <br />
                Message: {form.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'join' && (
        <div className="mailbox">
          <ul>
            {joinForms.map((form, index) => (
              <li key={index}>
                Name: {form.name} --|-- time: {form.timestamp ? format(form.timestamp.toDate(), 'h aaaa, MMM d yyyy') : 'N/A'}<br />
                Email: {form.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Mail;
