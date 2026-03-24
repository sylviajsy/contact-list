import {useState, useEffect} from 'react'
import ContactsList from '../ContactsPage/ContactsList';

const GroupPage = () => {
    const [groups, setGroups] = useState([]);

    useEffect(()=>{
        loadGroups();
    },[])

    const loadGroups = async () => {
        try {
            const res = await fetch("/api/group");

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Failed to fetch groups");
            }

            const data = await res.json();
            console.log("Group data", data);
            setGroups(data);
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }
  return (
    <div>
        <h1>Groups</h1>
        {groups.map((group) => (
            <div key={group.id} className="group-section">
                <h2 className="group-title">{group.name}</h2>
                {group.contacts.length == 0 ?(
                    <p>No contacts</p>
                ):(
                    <ContactsList contacts={group.contacts} />
                )}
            </div>
        ))}
    </div>
  )
}

export default GroupPage
