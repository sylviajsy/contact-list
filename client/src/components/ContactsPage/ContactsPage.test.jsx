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
})