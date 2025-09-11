import express from "express";
import {
  createUserPost,
  deleteUserPost,
  getAllUserPosts,
  likeOrDislike,
  bookmarkOrRemove,
  getAllPosts,
  getPostsByUser,

} from "../controllers/userPostController.js";
import isAuthenticated from "../config/auth.js";
import { upload } from "../middlewares/multer.js"; // Multer middleware

const router = express.Router();

// ===============================
// Create a new post with text + images
// Multer expects field name "images", max 5 files
// ===============================
router.post("/create", isAuthenticated, upload.array("images", 5), createUserPost);

// ===============================
// Delete a post by ID
// ===============================
router.delete("/delete/:id", isAuthenticated, deleteUserPost);

// ===============================
// Like / Dislike toggle
// ===============================
router.put("/like/:id", isAuthenticated, likeOrDislike);

// ===============================
// Bookmark / Remove bookmark toggle
// ===============================
router.put("/bookmark/:id", isAuthenticated, bookmarkOrRemove);


// ===============================
// Get all posts of a logged-in user + their following
// ===============================
router.get("/allUserPosts/:id", isAuthenticated, getAllUserPosts);

// ===============================
// Get all posts for feed
// ===============================
router.get("/all", isAuthenticated, getAllPosts);

router.get("/user/:id", isAuthenticated, getPostsByUser);


export default router;
