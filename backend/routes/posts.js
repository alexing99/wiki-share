import express from "express";
import User from "../models/user.js";
import Post from "../models/Post.js";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Yo");
// });
// Route handler for creating a new post
router.post("/", async (req, res) => {
  try {
    const post = new Post({
      author: req.body.author,
      content: req.body.content,
      article: req.body.article,
      timestamp: Date.now(),
    });

    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for getting all posts for feed
router.get("/", async (req, res) => {});

// Route for fetching single post
router.get("/:id", async (req, res) => {});

// Route for updating a post
router.patch("/:id", async (req, res) => {});

// Route for deleting a post
router.delete("/:id", async (req, res) => {});

// Route for getting all post by a specific author
// router.get("?author=:authorId", async (req, res) => {});

// // Route for pagination
// router.get("?page=:page&limit=:limit", async (req, res) => {});

export default router;
