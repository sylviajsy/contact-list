import React, { useState, useEffect } from 'react'
import { toast } from "react-toastify";
import ContactsList from './ContactsList';
import ContactForm from './ContactForm';
import ContactsDetail from './ContactsDetail';
import "./ContactsPage.css" 

const ContactsPage = () => {
    const [contacts, setContacts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = async () => {
        try{
          const res = await fetch("/api/contacts");
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "Failed to fetch Contacts");
          }

          const data = await res.json();
          setContacts(data);

          } catch (error) {
            console.error(error);
            toast.error("Network error. Please try again later.");
          }
    }

    const onAdd = async(newContacts) => {
        try {
            const response = await fetch("/api/contacts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newContacts),
            });

            if (response.ok){
                const data = await response.json();
                console.log("Contacts:", data);
                toast.success("New Contact added successfully");
                await loadContacts();
                setEditingContact(null);
                setShowModal(false);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to add contact"); 
            }
            
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const handleOpenDetail = async (contactId) => {
      try {
        const res = await fetch(`/api/contacts/${contactId}`);

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch contact details");
        }

        const data = await res.json();
        setSelectedContact(data);
        setShowDetailModal(true);
        console.log("Contact Detail Data", data);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }

    const onEdit = async (contactId) => {
      try {
        const res = await fetch(`/api/contacts/${contactId}`);
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch contact");
        }

        const data = await res.json();
        console.log("Edit Contact Data", data);

        setEditingContact(data);
        setShowModal(true);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }

  return (
    <div>
      <h1>Contacts</h1>
      <ContactsList contacts={contacts} handleOpenDetail={handleOpenDetail} onEdit={onEdit}/>
      {showDetailModal && selectedContact && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn" 
              onClick={() => setShowDetailModal(false)}
            >
              &times;
            </button>
            <ContactsDetail selectedContact={selectedContact}/>
          </div>
        </div>
      )}
      <button className="add-btn" onClick={() => setShowModal(true)}>
          Add Contact
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-btn" 
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <ContactForm 
              contactData = {editingContact}
              onSubmit={editingContact ? onEdit : onAdd}/>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactsPage
