import { UserPost } from "../models/userPostSchema.js";
import { User } from "../models/userSchema.js";

// ===============================
// ✅ Create a new post
// ===============================
export const createUserPost = async (req, res) => {
  try {
    const { description, id } = req.body;
    if (!id) return res.status(400).json({ success: false, message: "User ID is required" });

    const files = req.files || [];
    const imageFilenames = files.map(file => file.filename);

    if (!description && imageFilenames.length === 0)
      return res.status(400).json({ success: false, message: "Post cannot be empty" });

    const newPost = new UserPost({
      description,
      images: imageFilenames,
      userId: id,
    });

    await newPost.save();

    const populatedPost = await UserPost.findById(newPost._id)
      .populate("userId", "name username profilePic");

    if (!populatedPost) {
      return res.status(500).json({ success: false, message: "Failed to populate post after creation" });
    }

    const postWithFullImages = {
      ...populatedPost._doc,
      images: populatedPost.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    };

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: postWithFullImages,
    });
  } catch (error) {
    console.error("Error in createUserPost:", error);
    return res.status(500).json({ success: false, message: "Failed to create post", error: error.message });
  }
};
// ===============================
// ✅ Delete a post
// ===============================
export const deleteUserPost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "Post ID is required" });
    const deleted = await UserPost.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({ success: true, message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error in deleteUserPost:", error);
    return res.status(500).json({ success: false, message: "Failed to delete post", error: error.message });
  }
};

// ===============================
// ✅ Like or dislike a post
// ===============================
export const likeOrDislike = async (req, res) => {
  try {
    const loggedInUserId = req.body.id;
    const postId = req.params.id;

    if (!loggedInUserId || !postId) {
      return res.status(400).json({ success: false, message: "User ID and Post ID are required" });
    }

    let post = await UserPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found", success: false });

    let action;
    if (post.like.includes(loggedInUserId)) {
      post.like.pull(loggedInUserId);
      action = "disliked";
    } else {
      post.like.push(loggedInUserId);
      action = "liked";
    }

    await post.save();

    const updatedPost = await UserPost.findById(postId)
      .populate("userId", "name username profilePic");

    if (!updatedPost) {
      return res.status(500).json({ success: false, message: "Failed to update post after like/dislike" });
    }

    const postWithFullImages = {
      ...updatedPost._doc,
      images: updatedPost.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    };

    return res.status(200).json({
      message: `Post ${action}`,
      success: true,
      post: postWithFullImages,
    });
  } catch (error) {
    console.error("Error in likeOrDislike:", error);
    return res.status(500).json({ success: false, message: "Failed to like/dislike post", error: error.message });
  }
};


// ===============================
// ✅ Bookmark or remove bookmark
// ===============================
export const bookmarkOrRemove = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.body;
    const { id: postId } = req.params;

    if (!loggedInUserId || !postId) {
      return res.status(400).json({ success: false, message: "User ID and Post ID are required" });
    }

    const user = await User.findById(loggedInUserId);
    const post = await UserPost.findById(postId);

    if (!user || !post) {
      return res.status(404).json({ success: false, message: "User or Post not found" });
    }

    let action;
    if (user.bookmarks.includes(postId)) {
      user.bookmarks.pull(postId);
      post.bookmarks.pull(loggedInUserId);
      action = "removed from bookmarks";
    } else {
      user.bookmarks.push(postId);
      post.bookmarks.push(loggedInUserId);
      action = "bookmarked";
    }

    await user.save();
    await post.save();

    // Fetch updated bookmarks with post details for frontend
    const bookmarks = await UserPost.find({ _id: { $in: user.bookmarks } })
      .populate("userId", "name username profilePic")
      .sort({ createdAt: -1 });

    const bookmarksWithFullImages = bookmarks.map(bm => ({
      ...bm._doc,
      images: bm.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    }));

    const updatedPost = await UserPost.findById(postId)
      .populate("userId", "name username profilePic");

    if (!updatedPost) {
      return res.status(500).json({ success: false, message: "Failed to update post after bookmark/unbookmark" });
    }

    const postWithFullImages = {
      ...updatedPost._doc,
      images: updatedPost.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    };

    return res.status(200).json({
      success: true,
      message: `Post ${action}`,
      post: postWithFullImages,
      userBookmarks: user.bookmarks,
      posts: bookmarksWithFullImages // send updated bookmarks for frontend
    });
  } catch (error) {
    console.error("Error in bookmarkOrRemove:", error);
    return res.status(500).json({ success: false, message: "Failed to bookmark/unbookmark post", error: error.message });
  }
};


// ===============================
// ✅ Get posts of logged-in user + following
// ===============================
export const getAllUserPosts = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "User ID is required" });

    const loggedInUser = await User.findById(id);

    if (!loggedInUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const userPosts = await UserPost.find({ userId: id })
      .populate("userId", "name username profilePic");

    const followingPosts = await Promise.all(
      loggedInUser.following.map((otherId) =>
        UserPost.find({ userId: otherId }).populate("userId", "name username profilePic")
      )
    );

    // Format image URLs for all posts
    const allPosts = [...userPosts, ...followingPosts.flat()].map(post => ({
      ...post._doc,
      images: post.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    }));

    return res.status(200).json({
      success: true,
      posts: allPosts.sort((a, b) => b.createdAt - a.createdAt),
    });
  } catch (error) {
    console.error("Error in getAllUserPosts:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch posts", error: error.message });
  }
};

// ===============================
// ✅ Get all posts (feed)
// ===============================
export const getAllPosts = async (req, res) => {
  try {
    const posts = await UserPost.find()
      .populate("userId", "name username profilePic")
      .sort({ createdAt: -1 });

    const postsWithFullImages = posts.map(post => ({
      ...post._doc,
      images: post.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    }));

    res.status(200).json({ success: true, posts: postsWithFullImages });
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch posts", error: error.message });
  }
};

export const getPostsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "User ID is required" });

    const userExists = await User.findById(id);

    if (!userExists) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const posts = await UserPost.find({ userId: id })
      .populate("userId", "name username profilePic")
      .sort({ createdAt: -1 });

    // Format image URLs for all posts
    const postsWithFullImages = posts.map(post => ({
      ...post._doc,
      images: post.images.map(img => `http://localhost:8080/uploads/posts/${img}`)
    }));

    return res.status(200).json({ success: true, posts: postsWithFullImages });
  } catch (error) {
    console.error("Error in getPostsByUser:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch user posts", error: error.message });
  }
};

