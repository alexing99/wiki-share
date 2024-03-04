// login.js
import express from "express";
import passport from "./passport-config.js"; // Assuming passport-config.js is globally imported
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const router = express.Router();

// Route for user login
router.post("/", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ id: user._id }, "your-secret-key"); // Replace 'your-secret-key' with a secure random key
      return res.json({ token });
    });
  })(req, res, next);
});

export default router;
