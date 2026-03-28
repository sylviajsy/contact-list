import '@testing-library/jest-dom'
import { render, screen } from "@testing-library/react";
import ContactsList from "./ContactsList";
import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';

const mockContacts = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "512-123-4567",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "512-987-6543",
  },
];

describe('ContactList Unit Test', () => {
    test('renders contact list', () => {
        render(<ContactsList contacts={mockContacts} />);

        expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
        expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    })

    test("calls handleEdit when Edit button is clicked", async () => {
        const user = userEvent.setup();
        const mockEdit = vi.fn();

        render(
            <ContactsList contacts={mockContacts} handleEdit={mockEdit} />
        );

        const editButtons = screen.getAllByTestId("edit-contact-btn");

        await user.click(editButtons[0]);

        expect(mockEdit).toHaveBeenCalledWith(mockContacts[0].id);
    });
})