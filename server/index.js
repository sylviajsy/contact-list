import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/db.js";

import contactsRoutes from "./routes/contacts.js";
import groupRoutes from "./routes/group.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW();");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error("DB connection error:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/group', groupRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});