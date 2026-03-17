import React from 'react'

const ContactsList = ({ contacts }) => {

    if (!contacts || contacts.length === 0) {
        return <p>No contacts found</p>;
    }
    
  return (
    <div className="contacts-grid">
        {contacts.map((contact) => (
            <div key={contact.id} className="contact-card">

            <h3>{contact.name}</h3>

            <p>{contact.email}</p>

            </div>
      ))}

      
    </div>
  )
}

export default ContactsList
