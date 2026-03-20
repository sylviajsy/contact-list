import "./ContactsDetail.css" 

const getInitials = (name) => {
  const matches = name.match(/\b\w/g);
  return matches.join("").toUpperCase();
};

const ContactsDetail = ({ selectedContact }) => {

  return (
    <>
        <div className="detail-header">
        <div className="detail-avatar">{getInitials(selectedContact.name)}</div>

        <h2>{selectedContact.name}</h2>
        <p className="detail-email">{selectedContact.email}</p>
        </div>

        <div className="detail-body">
            <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span>{selectedContact.phone || "No phone"}</span>
            </div>

            <div className="detail-row">
                <span className="detail-label">Groups</span>
                <span>{selectedContact.groups || "No Group"}</span>
            </div>

            <div className="detail-row">
                <span className="detail-label">Notes</span>
                <span>{selectedContact.notes || "No Notes"}</span>
            </div>
        </div>
    </>
  )
}

export default ContactsDetail
