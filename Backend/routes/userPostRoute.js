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

// Async wrapper for controllers to catch errors
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ===============================
// Create a new post with text + images
// Multer expects field name "images", max 5 files
// ===============================
router.post("/create", isAuthenticated, upload.array("images", 5), asyncHandler(createUserPost));

// ===============================
// Delete a post by ID
// ===============================
router.delete("/delete/:id", isAuthenticated, asyncHandler(deleteUserPost));

// ===============================
// Like / Dislike toggle
// ===============================
router.put("/like/:id", isAuthenticated, asyncHandler(likeOrDislike));

// ===============================
// Bookmark / Remove bookmark toggle
// ===============================
router.put("/bookmark/:id", isAuthenticated, asyncHandler(bookmarkOrRemove));


// ===============================
// Get all posts of a logged-in user + their following
// ===============================
router.get("/allUserPosts/:id", isAuthenticated, asyncHandler(getAllUserPosts));

// ===============================
// Get all posts for feed
// ===============================
router.get("/all", isAuthenticated, asyncHandler(getAllPosts));

router.get("/user/:id", isAuthenticated, asyncHandler(getPostsByUser));


export default router;
