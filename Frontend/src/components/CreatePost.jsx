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
        <div className="p-4 border-b border-gray-300">
          {/* Back button */}
          <div className="flex items-center mb-3">
            <button
              onClick={() => dispatch(setIsCreatingPost(false))}
              className="flex items-center cursor-pointer"
            >
              <IoArrowBack size={22} className="mr-1" /> Back
            </button>
          </div>

          {/* Input field */}
          <div className="flex items-center">
            <Avatar src={user?.profilePic} size="40" className="rounded-full" />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px]  outline-none border-none text-xl ml-2"
              type="text"
              placeholder="What's happening?"
            />
    
            <input
              type="file"
              id="imageUpload"
              accept="image/*"
              multiple
              hidden
              onChange={handleImagesChange}
            />
            <label htmlFor="imageUpload" className="ml-2 cursor-pointer">
              <CiImageOn size="24px" />
            </label>

            <button
              onClick={submitHandler}
              className="bg-[#1D9BF0] px-4 py-1 text-lg text-white rounded-full ml-2"
            >
              Post
            </button>
          </div>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white px-1 py-0.5 text-xs rounded"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center justify-evenly border-b border-gray-200">
            <div
              onClick={() => dispatch(getIsActive(true))}
              className={`${
                isActive
                  ? "border-b-4 border-blue-600"
                  : "border-b-4 border-transparent"
              } cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}
            >
              <h1 className="font-semibold text-gray-600 text-lg">For You</h1>
            </div>
            <div
              onClick={() => dispatch(getIsActive(false))}
              className={`${
                !isActive
                  ? "border-b-4 border-blue-600"
                  : "border-b-4 border-transparent"
              } cursor-pointer hover:bg-gray-200 w-full text-center px-4 py-3`}
            >
              <h1 className="font-semibold text-gray-600 text-lg">Following</h1>
            </div>
          </div>

          {/* Following Users */}
          {!isActive && (
            <div className="p-4">
              {followingUsers?.length > 0 ? (
                followingUsers.map((followingUser) => (
                  <Link key={followingUser._id} to={`/profile/${followingUser._id}`}>
                    <div className="flex items-center p-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100">
                      <Avatar
                        src={followingUser.profilePic}
                        size="40"
                        round={true}
                      />
                      <div className="ml-2">
                        <h1 className="font-bold">{followingUser.name}</h1>
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

