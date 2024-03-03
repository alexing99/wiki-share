// Import necessary modules and your User model
import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Yo");
});
// Route handler for creating a new user
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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
