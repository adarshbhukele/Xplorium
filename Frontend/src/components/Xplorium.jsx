import React from "react";
import Avatar from "react-avatar";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiHeart, CiBookmark } from "react-icons/ci";
import axios from "axios";
import { Xplorium_API_END_POINT, timeSince } from "../utils/constant";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateXplorium as updateReduxXplorium, deleteXplorium as deleteFromRedux } from "../redux/XploriumSlice";

const Xplorium = ({ Xplorium, onUpdate, onDelete }) => {
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const likeOrDislikeHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${Xplorium_API_END_POINT}/like/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      // 🔹 Update frontend instantly
      if (onUpdate) onUpdate(data.post);
      dispatch(updateReduxXplorium(data.post));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to like post");
    }
  };

  const bookmarkHandler = async (id) => {
    try {
      const { data } = await axios.put(
        `${Xplorium_API_END_POINT}/bookmark/${id}`,
        { id: user?._id },
        { withCredentials: true }
      );
      // 🔹 Update frontend instantly
      if (onUpdate) onUpdate(data.post);
      dispatch(updateReduxXplorium(data.post));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to bookmark post");
    }
  };

  const deleteXploriumHandler = async (id) => {
    try {
      await axios.delete(`${Xplorium_API_END_POINT}/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Post deleted");
      // 🔹 Remove instantly from frontend
      if (onDelete) onDelete(id);
      dispatch(deleteFromRedux(id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete post");
    }
  };

  const isOwner = user?._id === Xplorium?.userId?._id;

  return (
    <div className="border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all bg-white mb-5">
      <div className="flex p-4">
        {/* Avatar */}
        <div
          className="cursor-pointer"
          onClick={() => navigate(`/profile/${Xplorium?.userId?._id}`)}
        >
          <Avatar src={Xplorium?.userId?.profilePic} size="48" round={true} />
        </div>

        {/* Content */}
        <div className="ml-3 w-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="font-semibold text-gray-800 hover:underline cursor-pointer"
                onClick={() => navigate(`/profile/${Xplorium?.userId?._id}`)}
              >
                {Xplorium?.userId?.name}
              </h1>
              <p
                className="text-gray-500 text-sm"
                title={new Date(Xplorium?.createdAt).toLocaleString()}
              >
                @{Xplorium?.userId?.username} · {timeSince(Xplorium?.createdAt)}
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => deleteXploriumHandler(Xplorium?._id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors cursor-pointer"
                title="Delete post"
              >
                <MdOutlineDeleteOutline size="22px" />
              </button>
            )}
          </div>

          {/* Description */}
          {Xplorium?.description && (
            <p className="mt-3 text-gray-700 leading-relaxed whitespace-pre-wrap">
              {Xplorium?.description}
            </p>
          )}

          {/* Images */}
          {Xplorium?.images?.length > 0 && (
            <div
              className={`mt-3 grid gap-2 overflow-hidden rounded-xl ${
                Xplorium.images.length === 1
                  ? "grid-cols-1"
                  : Xplorium.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {Xplorium.images.map((img, index) => (
                // <img
                //   key={index}
                //   src={img}
                //   alt={`Post ${index + 1}`}
                //   className="w-full h-60 object-cover rounded-xl hover:opacity-90 transition"
                // />
             <img
  key={index}
  src={img} // already full URL
  alt={`Post ${index + 1}`}
  className="w-full h-60 object-cover rounded-xl hover:opacity-90 transition"
/>
              ))}
            
              
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-start items-center mt-4 space-x-8">
            {/* Like */}
            <button
              onClick={() => likeOrDislikeHandler(Xplorium?._id)}
              className="flex items-center px-3 py-2 rounded-full hover:bg-pink-50 transition-all cursor-pointer active:scale-90"
            >
              <CiHeart
                size="26px"
                className={`transition-colors ${
                  Xplorium?.like?.includes(user?._id)
                    ? "text-pink-600"
                    : "text-gray-600"
                }`}
              />
              <span className="ml-1 text-sm text-gray-700 cursor-pointer">
                {Xplorium?.like?.length || 0}
              </span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => bookmarkHandler(Xplorium?._id)}
              className="flex items-center px-3 py-2 rounded-full hover:bg-yellow-50 transition-all active:scale-90 cursor-pointer"
            >
              <CiBookmark
                size="26px"
                className={`transition-colors ${
                  Xplorium?.bookmarks?.includes(user?._id)
                    ? "text-yellow-500"
                    : "text-gray-600"
                }`}
              />
              <span className="ml-1 text-sm text-gray-700">
                {Xplorium?.bookmarks?.length || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Xplorium;
