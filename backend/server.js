import express from "express";
import session from "express-session";
import mongoose from "mongoose";
// import dotenv from "dotenv";
import cors from "cors";
import passport from "./passport-config.js";
import path from "path";
import loginRoutes from "./routes/login.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import MongoStore from "connect-mongo";

// dotenv.config({ path: "../.env" });
const app = express();
const uri = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://peecer.netlify.app",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
// app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Peecer!");
});
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
