import '@testing-library/jest-dom'
import { render, screen, waitFor } from "@testing-library/react";
import ContactsPage from "./ContactsPage";
import { describe } from 'vitest';
import { vi } from "vitest";
import userEvent from '@testing-library/user-event';

// mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockContacts = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "512-123-4567",
    notes: "Friend",
    groups: "Family",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "512-555-2222",
    notes: "Coworker",
    groups: "Work",
  },
];

describe('Contacts Page Integration Test', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    test('loads and displays contacts when page render', async () => {
        vi.spyOn(global, "fetch").mockResolvedValueOnce({
            ok: true,
            json: async () => mockContacts,
        });

        render(<ContactsPage />);

        expect(await screen.findByText("Alice Johnson")).toBeInTheDocument();
        expect(await screen.findByText("Bob Smith")).toBeInTheDocument();
    })
    
    test('opens edit modal with prefilled contact data', async () => {
        const user = userEvent.setup();

        vi.spyOn(global, "fetch")
        // first call: loadContacts
        .mockResolvedValueOnce({
            ok: true,
            json: async () => mockContacts,
        })
        // second call: handleEdit -> fetch one contact
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                id: 1,
                name: "Alice Johnson",
                email: "alice@example.com",
                phone: "512-123-4567",
                notes: "Friend",
                groups: "Family",
                group_id: [1,2],
            }),
        })
        // third call: ContactForm loadGroups
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, name: "Family" },
                { id: 2, name: "Work" },
            ],
        })

        render(<ContactsPage />);

        expect(await screen.findByText("Alice Johnson")).toBeInTheDocument();

        const editButtons = screen.getAllByTestId("edit-contact-btn");
        await user.click(editButtons[0]);

        await waitFor(() => {
            expect(screen.getByDisplayValue("Alice Johnson")).toBeInTheDocument();
            expect(screen.getByDisplayValue("alice@example.com")).toBeInTheDocument();
        })
    })
})