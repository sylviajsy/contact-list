import {useState, useEffect} from 'react'
import { toast } from "react-toastify";
import "./ContactForm.css";

const ContactForm = ({ onSubmit, contactData }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notes: "",
        group_id: []
    });

    const [groups, setGroups] = useState([]);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (contactData){
            setFormData({
                name: contactData.name || "",
                email: contactData.email || "",
                phone: contactData.phone || "",
                notes: contactData.notes || "",
                group_id: contactData.group_id || [],
            });
        }
    },[contactData])

    const loadGroups = async () => {
        try {
            const res = await fetch("/api/group");

            if (!res.ok) {
                throw new Error("Failed to fetch group");
            }

            const data = await res.json();
            setGroups(data);

        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleGroupChange = (groupid) => {
        setFormData((prev) => {

            const exists = prev.group_id.includes(groupid);

            return {
                ...prev,
                group_id: exists
                    ? prev.group_id.filter((id) => id !== groupid)
                    : [...prev.group_id, groupid]
                };
        });
    }

    const clearForm = () => {
        setFormData({ name: "", email: "", phone: "", notes: "", group_id: [] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        clearForm();
    };

  return (
    <div>
        <h3> Add New Contact </h3>
        <form className="contact-form" onSubmit={handleSubmit}>
            <label>
                Name 
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    minLength={2}
                />
            </label>

            <label>
                Email 
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </label>

            <label>
                Phone 
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </label>

            <label>Groups</label>

                <div className="groups-checkbox">
                    {groups.map((group) => (
                        <label key={group.id} className="checkbox-item">

                        <input
                            type="checkbox"
                            checked={formData.group_id.includes(group.id)}
                            onChange={() => handleGroupChange(group.id)}
                        />

                        {group.name}

                        </label>
                    ))}
                </div>

            <label>
                Notes 
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                />
            </label>

            <button type="submit">
                Add
            </button>
        </form>
    </div>
  )
}

export default ContactForm
