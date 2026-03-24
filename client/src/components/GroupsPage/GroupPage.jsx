import {useState, useEffect} from 'react'

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
            <div key={group.id}>
                <h2>{group.name}</h2>
            </div>
        ))}
    </div>
  )
}

export default GroupPage
