import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./passport-config.js";

import loginRoutes from "./routes/login.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
// const express = require("express");
// const session = require("express-session");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const passport = require("./passport-config.js");

// const loginRoutes = require("./routes/login.js");
// const userRoutes = require("./routes/users.js");
// const postRoutes = require("./routes/posts.js");

dotenv.config({ path: "../.env" });

const uri = process.env.MONGODB_URI;
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/users", userRoutes);
app.use("/login", loginRoutes);
app.use("/posts", postRoutes);

// MongoDB connection
mongoose.set("strictQuery", false); // or true based on your preference

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully!");
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
