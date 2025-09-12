import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import { CiImageOn } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { Xplorium_API_END_POINT, USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllXploriums,
  getIsActive,
  setIsCreatingPost,
} from "../redux/XploriumSlice";
import { Link } from "react-router-dom";

const CreatePost = () => {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [followingUsers, setFollowingUsers] = useState([]);

  const { user } = useSelector((store) => store.user);
  const { isActive, isCreatingPost, Xploriums } = useSelector(
    (store) => store.Xplorium
  );
  const dispatch = useDispatch();

  // ✅ Fetch posts only once on mount
  useEffect(() => {
    if (Xploriums.length === 0) {
      fetchPosts();
    }
  }, []);

  // ✅ Fetch following users only when switching to Following tab
  useEffect(() => {
    if (!isActive && followingUsers.length === 0) {
      fetchFollowingUsers();
    }
  }, [isActive]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${Xplorium_API_END_POINT}/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(getAllXploriums(res.data.posts));
      }
    } catch {
      toast.error("Failed to fetch posts");
    }
  };

  const fetchFollowingUsers = async () => {
    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/following/${user._id}`,
        { withCredentials: true }
      );
      if (res.data.success) setFollowingUsers(res.data.followingUsers);
    } catch {
      toast.error("Failed to fetch following users");
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5); // max 5 images
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const submitHandler = async () => {
    if (!description.trim() && images.length === 0) {
      return toast.error("Post cannot be empty!");
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("id", user._id);
      images.forEach((img) => formData.append("images", img));

      const res = await axios.post(
        `${Xplorium_API_END_POINT}/create`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setDescription("");
        setImages([]);
        setImagePreviews([]);
        dispatch(setIsCreatingPost(false));
        if (isActive) fetchPosts(); // refresh only if For You tab
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="w-full">
      {isCreatingPost ? (
        <div className="p-6 border-b border-gray-300 bg-white rounded-2xl shadow-lg max-w-2xl mx-auto mt-4">
          {/* Back button */}
          <div className="flex items-center mb-4">
            <button
              onClick={() => dispatch(setIsCreatingPost(false))}
              className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition"
            >
              <IoArrowBack size={22} className="mr-1" /> Back
            </button>
          </div>

          {/* Input field */}
          <div className="flex items-start gap-3">
            <Avatar src={user?.profilePic} size="44" className="rounded-full" />
            <div className="flex-1">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[80px] resize-none outline-none border border-gray-200 rounded-xl px-4 py-3 text-lg bg-gray-50 focus:bg-white focus:border-blue-400 transition scrollbar-none"
                placeholder="What's happening?"
                style={{ scrollbarWidth: 'none' }}
              />
              <div className="flex items-center mt-2 gap-2">
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImagesChange}
                />
                <label htmlFor="imageUpload" className="cursor-pointer text-blue-500 hover:text-blue-700">
                  <CiImageOn size="26px" />
                </label>
                <button
                  onClick={submitHandler}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-2 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-pink-600 transition-all"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow group-hover:opacity-80 transition"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 text-xs rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center justify-evenly border-b border-gray-200 bg-white rounded-2xl shadow mb-4">
            <div
              onClick={() => dispatch(getIsActive(true))}
              className={`$${
                isActive
                  ? "border-b-4 border-blue-600 bg-blue-50"
                  : "border-b-4 border-transparent"
              } cursor-pointer hover:bg-blue-100 w-full text-center px-4 py-3 rounded-t-2xl transition`}
            >
              <h1 className="font-semibold text-gray-700 text-lg">For You</h1>
            </div>
            <div
              onClick={() => dispatch(getIsActive(false))}
              className={`$${
                !isActive
                  ? "border-b-4 border-blue-600 bg-blue-50"
                  : "border-b-4 border-transparent"
              } cursor-pointer hover:bg-blue-100 w-full text-center px-4 py-3 rounded-t-2xl transition`}
            >
              <h1 className="font-semibold text-gray-700 text-lg">Following</h1>
            </div>
          </div>

          {/* Following Users */}
          {!isActive && (
            <div className="p-4 bg-white rounded-2xl shadow">
              {followingUsers?.length > 0 ? (
                followingUsers.map((followingUser) => (
                  <Link key={followingUser._id} to={`/profile/${followingUser._id}`}>
                    <div className="flex items-center p-2 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition">
                      <Avatar
                        src={followingUser.profilePic}
                        size="40"
                        round={true}
                      />
                      <div className="ml-3">
                        <h1 className="font-bold text-gray-800">{followingUser.name}</h1>
                        <p className="text-sm text-gray-500">
                          @{followingUser.username}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-500 text-center p-4">
                  You are not following anyone yet.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CreatePost;

