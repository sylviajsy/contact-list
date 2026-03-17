import React, {useState} from 'react'

const ContactForm = ({ onAdd }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        notes: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const clearForm = () => {
        setForm({ name: "", email: "", phone: "", notes: "" });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        clearForm();
    };

  return (
    <div>
        <h3> Add New Individual </h3>
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
                Email *
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

            <label>
                Notes
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                />
            </label>

            <button type="submit" variant="outline-success">
                Add
            </button>
        </form>
    </div>
  )
}

export default ContactForm
