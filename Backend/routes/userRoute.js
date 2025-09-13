import express from "express";
import multer from "multer";
import {
    Login,
    Register,
    bookmark,
    follow,
    getMyProfile,
    getOtherUsers,
    logout,
    unfollow,
    updateProfile,
    getFollowingUsers,
    getBookmarkedPosts
} from "../controllers/userController.js";
import isAuthenticated from "../config/auth.js";

const router = express.Router();

// Async wrapper for controllers to catch errors
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Multer config (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route("/register").post(asyncHandler(Register));
router.route("/login").post(asyncHandler(Login));
router.route("/logout").get(asyncHandler(logout));
router.route("/bookmark/:id").put(isAuthenticated, asyncHandler(bookmark));
router.route("/profile/:id").get(isAuthenticated, asyncHandler(getMyProfile));
router.route("/otheruser/:id").get(isAuthenticated, asyncHandler(getOtherUsers));
router.route("/follow/:id").post(isAuthenticated, asyncHandler(follow));
router.route("/unfollow/:id").post(isAuthenticated, asyncHandler(unfollow));
router.route("/following/:id").get(isAuthenticated, asyncHandler(getFollowingUsers));
router.get("/bookmarks", isAuthenticated, asyncHandler(getBookmarkedPosts));

// profile update with file upload
router.route("/update/:id").put(
    isAuthenticated,
    upload.fields([{ name: "profilePic" }, { name: "bannerPic" }]),
    asyncHandler(updateProfile)
);

export default router;
