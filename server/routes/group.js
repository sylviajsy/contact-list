import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Get all groups
router.get('/', async (req,res) => {
    try {
        const groups = await db.query(
            `SELECT id, name
            FROM groups
            ORDER BY name`
        );

        let result = [];

        for (const group of groups.rows){
            const contacts = await db.query(
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
                ORDER BY contacts.name;
                `,
                [group.id]
            );

            result.push({
                ...group,
                contacts:contacts.rows,
            })
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
})

export default router;