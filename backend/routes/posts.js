import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Yo");
// });
// Route handler for creating a new post
router.post("/", async (req, res) => {});

// Route for getting all posts for feed
router.get("/", async (req, res) => {});

// Route for fetching single post
router.get("/:id", async (req, res) => {});

// Route for updating a post
router.patch("/:id", async (req, res) => {});

router.delete("/:id", async (req, res) => {});

router.get("?author=:authorId", async (req, res) => {});

// Route for pagination
router.get("?page=:page&limit=:limit", async (req, res) => {});

export default router;
