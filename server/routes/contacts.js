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
    const client = await db.connect();

    try {
        const { name, email, phone, notes, group_id } = req.body;

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

        // Use Transaction to make sure both success, otherwise both fail
        await client.query("BEGIN");

        const contactResult = await client.query(
            `
            INSERT INTO contacts (name, email, phone, notes)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [name, email, phone||null, notes||null]
        );

        const newContact = contactResult.rows[0];

        if (Array.isArray(group_id) && group_id.length > 0) {
            const insertPromises = group_id.map(groupId => 
                client.query(
                    `INSERT INTO contact_groups (contact_id, group_id) VALUES ($1, $2);`,
                    [newContact.id, groupId]
                )
            );
            await Promise.all(insertPromises);
        }

        await client.query("COMMIT");

        res.status(201).json(newContact);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to add contact" });
    } finally {
        client.release();
    }
})

export default router;