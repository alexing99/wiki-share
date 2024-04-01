import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  memberSince: Date,
  interestedIn: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  foundRelevant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the same Post schema for nested replieschema}],
    },
  ],
});

const User = mongoose.model("User", userSchema);

export default User;
