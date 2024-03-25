import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  article: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  parentPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the same Post schema for nested replieschema}],
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
