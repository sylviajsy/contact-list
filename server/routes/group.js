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

export default router;