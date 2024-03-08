// login.js
import express from "express";
import passport from "../passport-config.js"; // Assuming passport-config.js is globally imported
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
import cookie from "cookie";

dotenv.config({ path: "../../.env" });

const router = express.Router();

// Route for user login
router.post("/", (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials", user });
    }
    req.login(user, { session: false }, async (err) => {
      if (err) {
        return next(err);
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5h",
      });
      //   res.setHeader(
      //     "Set-Cookie",
      //     cookie.serialize("token", token, {
      //       httpOnly: true, // Cookie cannot be accessed by client-side JavaScript
      //       secure: false, // Cookie is only sent over HTTPS
      //       sameSite: "strict", // Cookie is sent only for same-site requests
      //       maxAge: 60 * 60 * 5, // Max age of the cookie in seconds (5 hours)
      //       path: "/", // Path for which the cookie is valid
      //     })
      //   );

      return res.json({ token });
    });
  })(req, res, next);
});

export default router;
