import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Get all groups
router.get('/', async (req,res) => {
    try {
        const result = await db.query(
            `SELECT id, name
            FROM groups
            ORDER BY name`
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
})

// Get all contacts under a group
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            `
            SELECT
                contacts.id,
                contacts.name,
                contacts.email,
                contacts.phone,
                contacts.notes
            FROM contacts
            JOIN contact_groups cg ON contacts.id = cg.contact_id
            WHERE cg.group_id = $1
            GROUP BY contacts.id
            ORDER BY contacts.name;
            `,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch group contacts" });
    }
})

export default router;