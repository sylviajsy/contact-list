import React from 'react'
import "./ContactsList.css" 

const getInitials = (name) => {
  const matches = name.match(/\b\w/g);
  return matches.join("").toUpperCase();
};

const ContactsList = ({ contacts, handleOpenDetail, handleEdit }) => {

    if (!contacts || contacts.length === 0) {
        return <p>No contacts found</p>;
    }

  return (
    <div className="contacts-grid">
        {contacts.map((contact) => (
            <div key={contact.id} className="contact-card" onClick={()=>handleOpenDetail(contact.id)}>

              <div className="avatar">
                  {getInitials(contact.name)}
              </div>

              <h3>{contact.name}</h3>

              <p>{contact.email}</p>

              <div className="card-actions">
                <button onClick={() => handleEdit(contact.id)}>Edit</button>
              </div>

            </div>
      ))}

    </div>
  )
}

export default ContactsList
