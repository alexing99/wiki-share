import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: { type: String, require: true },
  article: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post", // Reference to the same Post schema for nested replieschema}],
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

export default Post;
