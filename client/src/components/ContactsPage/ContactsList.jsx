import React from 'react'

const ContactsList = ({ contacts }) => {
    
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
