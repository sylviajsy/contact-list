import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Get all contacts
router.get('/', async (req,res) => {
    try{
        const { search } = req.query;
        const params = [];
        const where = [];

        if (search){
            params.push(`%${search}%`);

            where.push(`
                contacts.name ILIKE $${params.length}
                OR contacts.email ILIKE $${params.length}
                OR contacts.phone ILIKE $${params.length}
                OR contacts.notes ILIKE $${params.length}
                OR groups.name ILIKE $${params.length}
            `);
        }

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
            ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
            GROUP BY contacts.id
            ORDER BY contacts.id
        `, params);

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
                COALESCE(STRING_AGG(groups.name, ', '), 'No Group') AS groups,
                ARRAY_REMOVE(ARRAY_AGG(groups.id), NULL) AS group_id
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

// Update a Contact
router.put('/:id', async(req, res) => {
    const client = await db.connect();

    try {
        const { id } = req.params;
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
            UPDATE contacts
            SET name = $1,
                email = $2,
                phone = $3,
                notes = $4
            WHERE id = $5
            RETURNING *;
            `,
            [name, email, phone||null, notes||null, id]
        );

        if (contactResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({
                error: "Contact not found",
            });
        }

        const updatedContact = contactResult.rows[0];

        // current group ids in DB
        const currentGroupsResult = await client.query(
            `
            SELECT group_id
            FROM contact_groups
            WHERE contact_id = $1;
            `,
            [id]
        );

        const currentGroupIds = currentGroupsResult.rows.map((row) => row.group_id);
        const nextGroupIds = Array.isArray(group_id) ? group_id : [];

        // find removed groups
        const removedGroupIds = currentGroupIds.filter(
            (groupId) => !nextGroupIds.includes(groupId)
        );

        // find newly added groups
        const addedGroupIds = nextGroupIds.filter(
            (groupId) => !currentGroupIds.includes(groupId)
        );

        // Delete only removed relationships
        if (removedGroupIds.length > 0) {
            await client.query(
                `
                DELETE FROM contact_groups
                WHERE contact_id = $1
                AND group_id = ANY($2::int[]);
                `,
                [id, removedGroupIds]
            );
        }

        // insert only new relationships
        for (const groupId of addedGroupIds) {
            await client.query(
                `
                INSERT INTO contact_groups (contact_id, group_id)
                VALUES ($1, $2);
                `,
                [id, groupId]
            );
        }

        await client.query("COMMIT");

        res.status(201).json(updatedContact);

    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to add contact" });
    } finally {
        client.release();
    }
})

// Delete a contact
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const client = await db.connect();

    try {
        // Use Transaction to make sure both success, otherwise both fail
        await client.query("BEGIN");

        // Delete contact_groups
        await client.query(
            `
            DELETE FROM contact_groups
            WHERE contact_id = $1;
            `,
            [id]
        );

        const result = await client.query(
            `DELETE FROM contacts WHERE id = $1 RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Contact not found" });
        }

        await client.query("COMMIT");

        res.json({ message: "Deleted successfully",
            deletedContact: result.rows[0],
         });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to delete contact" });
    } finally {
        client.release();
    }
})

export default router;