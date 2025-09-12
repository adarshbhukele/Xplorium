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
    <div className="border border-gray-200 rounded-3xl shadow-lg hover:shadow-2xl transition-all bg-gradient-to-br from-white via-blue-50 to-purple-50 mb-7">
      <div className="flex p-5">
        {/* Avatar */}
        <div
          className="cursor-pointer flex-shrink-0"
          onClick={() => navigate(`/profile/${Xplorium?.userId?._id}`)}
        >
          <Avatar src={Xplorium?.userId?.profilePic} size="54" round={true} className="shadow-md" />
        </div>

        {/* Content */}
        <div className="ml-4 w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1
                className="font-bold text-gray-800 hover:underline cursor-pointer text-lg"
                onClick={() => navigate(`/profile/${Xplorium?.userId?._id}`)}
              >
                {Xplorium?.userId?.name}
              </h1>
              <p
                className="text-gray-500 text-xs mt-0.5"
                title={new Date(Xplorium?.createdAt).toLocaleString()}
              >
                @{Xplorium?.userId?.username} · {timeSince(Xplorium?.createdAt)}
              </p>
            </div>

            {isOwner && (
              <button
                onClick={() => deleteXploriumHandler(Xplorium?._id)}
                className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors cursor-pointer shadow-sm"
                title="Delete post"
              >
                <MdOutlineDeleteOutline size="22px" />
              </button>
            )}
          </div>

          {/* Description */}
          {Xplorium?.description && (
            <p className="mt-2 text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
              {Xplorium?.description}
            </p>
          )}

          {/* Images */}
          {Xplorium?.images?.length > 0 && (
            <div
              className={`mt-4 grid gap-3 overflow-hidden rounded-xl ${
                Xplorium.images.length === 1
                  ? "grid-cols-1"
                  : Xplorium.images.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {Xplorium.images.map((img, index) => {
                let imgHeight = "h-48";
                if (Xplorium.images.length === 1) imgHeight = "h-80";
                else if (Xplorium.images.length === 2) imgHeight = "h-60";
                return (
                  <img
                    key={index}
                    src={img}
                    alt={`Post ${index + 1}`}
                    className={`w-full object-cover rounded-xl border border-gray-200 shadow hover:scale-105 hover:opacity-90 transition-all duration-200 ${imgHeight}`}
                  />
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-start items-center mt-5 space-x-10">
            {/* Like */}
            <button
              onClick={() => likeOrDislikeHandler(Xplorium?._id)}
              className={`flex items-center px-4 py-2 rounded-full hover:bg-pink-100 transition-all cursor-pointer active:scale-95 shadow-sm ${Xplorium?.like?.includes(user?._id) ? 'bg-pink-50' : ''}`}
            >
              <CiHeart
                size="26px"
                className={`transition-colors ${
                  Xplorium?.like?.includes(user?._id)
                    ? "text-pink-600"
                    : "text-gray-600"
                }`}
              />
              <span className="ml-2 text-base text-gray-700 cursor-pointer font-medium">
                {Xplorium?.like?.length || 0}
              </span>
            </button>

            {/* Bookmark */}
            <button
              onClick={() => bookmarkHandler(Xplorium?._id)}
              className={`flex items-center px-4 py-2 rounded-full hover:bg-yellow-100 transition-all active:scale-95 cursor-pointer shadow-sm ${Xplorium?.bookmarks?.includes(user?._id) ? 'bg-yellow-50' : ''}`}
            >
              <CiBookmark
                size="26px"
                className={`transition-colors ${
                  Xplorium?.bookmarks?.includes(user?._id)
                    ? "text-yellow-500"
                    : "text-gray-600"
                }`}
              />
              <span className="ml-2 text-base text-gray-700 font-medium">
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
