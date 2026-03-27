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

    test("each contact includes name and email", () => {
        if (data.length > 0) {
            expect(data[0]).toHaveProperty("name");
            expect(data[0]).toHaveProperty("email");
        }
    });
})

// POST create a new contact
describe('POST /api/contacts endpoint', () => {
    let response, data;

    beforeAll(async () => {
        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newContact)
        });
        data = await response.json();
    });

    test(('returns a response code of 201', () => {
            expect(response.status).toBe(201);
        })
    )

    test('returns an object', () => {
        expect(data).toBeTypeOf("object");
    });

    test('created contact has an id', () => {
        expect(data).toHaveProperty("id");
    });

    test('created contact has the correct name', () => {
        expect(data.name).toBe("Vitest User");
    });

})