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
router.patch("/:id", async (req, res) => {
  // Implement logic to update user profile by ID
  const userId = req.params.id;
  const { name, email, password } = req.body; // Assuming the request body contains the updated name and email

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's name and email
    if (name) {
      user.name = name;
    }

    // Update user's email if present in request body
    if (email) {
      user.email = email;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    await user.save();

    res.status(200).json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route for deleting user accounts
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    console.error("Error deleting user account");
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
