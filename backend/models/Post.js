import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: String,
  article: String,
  content: String,
  timestamp: Date,
  tags: [String],
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
