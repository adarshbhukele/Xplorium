import mongoose from "mongoose";

const UserPostSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  images: {
    type: [String], // Array of image URLs
    default: [],
  },
  like: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  bookmarks: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

export const UserPost = mongoose.model("UserPost", UserPostSchema);

