import { describe, test, expect, beforeAll } from 'vitest'

const url = 'http://localhost:3001/api/contacts'

const newContact = {
  name: "Vitest User",
  email: "vitest.user@example.com",
  phone: "512-123-4567",
  notes: "Created by test",
  group_id: [],
};

// GET all contacts
describe('GET /api/contacts endpoint', () => {
    let response, data;

    beforeAll(async () => {
        response = await fetch(url);
        data = await response.json();
    });
    
    test('returns a response code of 200', () => {
        expect(response.status).toBe(200);
    })

    test('returns an array', () => {
        expect(Array.isArray(data)).toBe(true);
    })
})