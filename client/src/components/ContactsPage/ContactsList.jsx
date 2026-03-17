import React from 'react'
import "./ContactsList.css" 

const getInitials = (name) => {
  const matches = name.match(/\b\w/g);
  return matches.join("").toUpperCase();
};

const ContactsList = ({ contacts }) => {

    if (!contacts || contacts.length === 0) {
        return <p>No contacts found</p>;
    }

  return (
    <div className="contacts-grid">
        {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">

            <div className="avatar">
                {getInitials(contact.name)}
            </div>

            <h3>{contact.name}</h3>

            <p>{contact.email}</p>

            </div>
      ))}

    </div>
  )
}

export default ContactsList
