import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import ContactsList from './ContactsList';

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try{
        const res = await fetch("/api/contacts");
        
        if (!res.ok) {
          const errorData = await res.json();
          toast.error(errorData || "Failed to fetch Contacts");
          return;
        }

        const data = await res.json();
        setContacts(data);

        } catch (error) {
          console.error(error);
          toast.error("Network error. Please try again later.");
        }
    }

  return (
    <div>
      <h1>Contacts</h1>
      <ContactsList contacts={contacts}/>
    </div>
  )
}

export default ContactsPage
