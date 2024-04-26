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
    const articleTitle = req.body.article.replace(/%20/g, " ");
    if (req.body.parent != "") {
      console.log("parent", req.body.parent);
      const post = new Post({
        author: req.body.author,
        content: req.body.content,
        article: articleTitle,
        image: req.body.imageString,
        timestamp: Date.now(),
        parentPost: req.body.parent,
        relevancyScore: 0,
        interestScore: 0,
      });

      const newPost = await post.save();
      res.status(201).json(newPost);
    } else {
      const post = new Post({
        author: req.body.author,
        content: req.body.content,
        article: articleTitle,
        image: req.body.imageString,
        timestamp: Date.now(),
        relevancyScore: 0,
        interestScore: 0,
      });

      const newPost = await post.save();
      res.status(201).json(newPost);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for getting all posts for feed
router.get("/", async (req, res) => {
  try {
    const allPosts = await Post.find({});
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Route for fetching root posts
// router.get("/rootposts", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const startIndex = (page - 1) * limit;

//     // Query the database for paginated root posts
//     const allRoots = await Post.find({
//       $or: [{ parentPost: { $exists: false } }],
//     })
//       .skip(startIndex)
//       .limit(limit);

//     // Optionally, you can also fetch the total count of root posts
//     // const totalCount = await Post.countDocuments({
//     //   $or: [{ parentPost: { $exists: false } }],
//     // });

//     // Send paginated root posts and total count in the response
//     res.status(200).json(allRoots);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
router.get("/rootposts", async (req, res) => {
  try {
    const allRoots = await Post.find({
      $or: [{ parentPost: { $exists: false } }],
    });
    res.status(200).json(allRoots);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Route for fetching children of particular roots
router.get("/:id/children", async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post with the given postId
    const parentPost = await Post.findById(postId);

    if (!parentPost) {
      return res.status(404).json({ message: "Parent post not found" });
    }

    const childrenIds = parentPost.children;

    // Fetch the children posts using their IDs
    const children = await Post.find({ _id: { $in: childrenIds } });

    res.status(200).json(children);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Route for getting all post by a specific author
router.get("/:author/author", async (req, res) => {
  try {
    const author = req.params.author;
    console.log(author);
    const postsByAuthor = await Post.find({ author: author });
    if (!postsByAuthor) {
      return res.status(404).json({ message: "Posts by author not found" });
    }
    res.status(200).json(postsByAuthor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for fetching single post
router.get("/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route for updating a post
router.patch("/:id", async (req, res) => {
  // Implement logic to update user profile by ID
  const postId = req.params.id;
  const { replyingWith } = req.body;

  try {
    console.log({ replyingWith });
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }

    post.children.push(replyingWith);

    await post.save();

    res.status(200).json({ message: "post information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.patch("/:id/score", async (req, res) => {
  const postId = req.params.id;
  const vote = req.query.vote;
  const action = req.query.action;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    if (vote === "interest") {
      if (action === "up") {
        ++post.interestScore;
      } else if (action === "down") {
        --post.interestScore;
      }
    } else if (vote === "relevance") {
      if (action === "up") {
        ++post.relevancyScore;
      } else if (action === "down") {
        --post.relevancyScore;
      }
    }
    await post.save();
    res.status(200).json({ message: "post information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route for deleting a post
router.delete("/:id", async (req, res) => {});

// // Route for pagination
// router.get("?page=:page&limit=:limit", async (req, res) => {});

export default router;
