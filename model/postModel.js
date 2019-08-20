const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    post_owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    images_url: [{ type: String, required: true }],
    topics: {
      type: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
      select: false
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = model("Post", postSchema);
