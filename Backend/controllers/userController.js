import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const Register = async (req, res) => {
  try {
    // Optional: Timeout safeguard
    const timeout = setTimeout(() => {
      return res.status(503).json({ message: "Request timed out", success: false });
    }, 10000); // 10 seconds

    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      clearTimeout(timeout);
      return res.status(401).json({ message: "All fields are required.", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      clearTimeout(timeout);
      return res.status(401).json({ message: "User already exists.", success: false });
    }

    // Reduce salt rounds for faster hashing
    const hashedPassword = await bcryptjs.hash(password, 10);

    await User.create({
      name,
      username,
      email,
      password: hashedPassword
    });

    clearTimeout(timeout);
    return res.status(201).json({
      message: "Account created successfully.",
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Login user
export const Login = async (req, res) => {
  try {
    // Optional: Timeout safeguard
    const timeout = setTimeout(() => {
      return res.status(503).json({ message: "Request timed out", success: false });
    }, 10000); // 10 seconds

    const { email, password } = req.body;

    if (!email || !password) {
      clearTimeout(timeout);
      return res.status(401).json({ message: "All fields are required.", success: false });
    }

    const user = await User.findOne({ email });
    if (!user) {
      clearTimeout(timeout);
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      clearTimeout(timeout);
      return res.status(401).json({ message: "Incorrect email or password", success: false });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "7d" });

    clearTimeout(timeout);
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .json({ message: `Welcome back ${user.name}`, user, success: true });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Logout
export const logout = (req, res) => {
  return res.cookie("token", "", { maxAge: 0 }).json({
    message: "User logged out successfully.",
    success: true
  });
};

// Bookmark post
export const bookmark = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const UserPostId = req.params.id;
    const user = await User.findById(loggedInUserId);

    if (user.bookmarks.includes(UserPostId)) {
      await User.findByIdAndUpdate(loggedInUserId, { $pull: { bookmarks: UserPostId } });
      return res.status(200).json({ message: "Removed from bookmarks." });
    } else {
      await User.findByIdAndUpdate(loggedInUserId, { $push: { bookmarks: UserPostId } });
      return res.status(200).json({ message: "Saved to bookmarks." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get my profile
export const getMyProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");
    return res.status(200).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get all other users
export const getOtherUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const otherUsers = await User.find({ _id: { $ne: id } }).select("-password");

    if (!otherUsers || otherUsers.length === 0) {
      return res.status(404).json({ message: "No other users found." });
    }

    return res.status(200).json({ otherUsers });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Follow user
export const follow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (!user.followers.includes(loggedInUserId)) {
      await user.updateOne({ $push: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $push: { following: userId } });
    } else {
      return res.status(400).json({ message: `Already following ${user.name}` });
    }

    return res.status(200).json({
      message: `${loggedInUser.name} just followed ${user.name}`,
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Unfollow user
export const unfollow = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const userId = req.params.id;

    const loggedInUser = await User.findById(loggedInUserId);
    const user = await User.findById(userId);

    if (loggedInUser.following.includes(userId)) {
      await user.updateOne({ $pull: { followers: loggedInUserId } });
      await loggedInUser.updateOne({ $pull: { following: userId } });
    } else {
      return res.status(400).json({ message: "You are not following this user" });
    }

    return res.status(200).json({
      message: `${loggedInUser.name} unfollowed ${user.name}`,
      success: true
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Update profile 
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    const { name, username, email, bio } = req.body;

    if (name) user.name = name;
    if (username) user.username = username;
    if (email) user.email = email;
    if (bio) user.bio = bio;

    // handle uploaded files
    if (req.files && req.files.profilePic && req.files.profilePic[0]) {
      user.profilePic = `data:${req.files.profilePic[0].mimetype};base64,${req.files.profilePic[0].buffer.toString("base64")}`;
    }

    if (req.files && req.files.bannerPic && req.files.bannerPic[0]) {
      user.bannerPic = `data:${req.files.bannerPic[0].mimetype};base64,${req.files.bannerPic[0].buffer.toString("base64")}`;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getFollowingUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.id);
    if (!currentUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch full user details for everyone this user is following
    const followingUsers = await User.find({ _id: { $in: currentUser.following } })
      .select("_id name username profilePic");

    res.json({ success: true, followingUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBookmarkedPosts = async (req, res) => {
  try {
    // Use req.user instead of req.id
    const user = await User.findById(req.user).populate({
      path: "bookmarks",
      populate: {
        path: "user", // populate owner of each post
        select: "name username profilePic"
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      posts: user.bookmarks
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
