// Import necessary modules and your User model
import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// router.get("/", (req, res) => {
//   res.send("Yo");
// });
// Route handler for creating a new user
router.post("/", async (req, res) => {
  // hashes the password
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Route for fetching user profiles
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user found, send user information in the response
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route for updating user profiles
router.put("/:id", async (req, res) => {
  // Implement logic to update user profile by ID
});

// Route for deleting user accounts
router.delete("/:id", async (req, res) => {
  // Implement logic to delete user account by ID
});
//   try {
//     // Extract user data from request body
//     const { name, email, password } = req.body;

//     // Create a new user instance
//     const newUser = new User({
//       name,
//       email,
//       password,
//     });

//     // Save the new user to the database
//     const savedUser = await newUser.save();

//     // Send a success response
//     res.status(201).json(savedUser);
//   } catch (error) {
//     // Send an error response if something goes wrong
//     console.error("Error creating user:", error);
//     res.status(500).json({ message: "Error creating user" });
//   }
// });

export default router;
