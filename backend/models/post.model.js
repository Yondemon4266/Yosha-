const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("post", postSchema);

module.exports = PostModel;
