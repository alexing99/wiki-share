import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import passport from "./passport-config.js";

import loginRoutes from "./routes/login.js";
import userRoutes from "./routes/users.js";

// import User from "../models/user.js";

dotenv.config({ path: "../.env" });

console.log("here", process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/users", userRoutes);
app.use("/login", loginRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
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
