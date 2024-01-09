const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comment", postSchema);

module.exports = CommentModel;
