import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Get all contacts
router.get('/', async (req,res) => {
    try{
        const result = await db.query(`
            SELECT
                contacts.id,
                contacts.name,
                contacts.email,
                contacts.phone,
                contacts.notes,
                COALESCE(STRING_AGG(groups.name, ', '), 'No Group') AS groups
            FROM contacts
            LEFT JOIN contact_groups
                ON contacts.id = contact_groups.contact_id
            LEFT JOIN groups
                ON groups.id = contact_groups.group_id
            GROUP BY contacts.id
            ORDER BY contacts.id
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
})

// Get one contact
router.get("/:id", async (req, res) => {

    const { id } = req.params;

    try {
        const result = await db.query(`
            SELECT
                contacts.id,
                contacts.name,
                contacts.email,
                contacts.phone,
                contacts.notes,
                COALESCE(STRING_AGG(groups.name, ', '), 'No Group') AS groups
            FROM contacts
            LEFT JOIN contact_groups
                ON contacts.id = contact_groups.contact_id
            LEFT JOIN groups
                ON groups.id = contact_groups.group_id
            WHERE contacts.id=$1
            GROUP BY contacts.id
        `,[id]);

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch contacts" });
    }
})

// Add Contact
router.post('/', async (req,res) => {
    try {
        const { name, email, phone, notes } = req.body;

        if (!name || name.length < 2) {
            return res.status(400).json({
                error: "Name must be at least 2 characters"
            });
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({
                error: "Please enter a valid email address."
            });
        }

        const result = await db.query(
            `
            INSERT INTO contacts (name, email, phone, notes)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [name, email, phone, notes]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add contact" });
    }
})

export default router;