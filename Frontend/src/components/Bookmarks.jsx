import React, { useEffect, useState } from "react";
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import Xplorium from "./Xplorium";
import toast from "react-hot-toast";

const Bookmarks = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleBookmarksUpdate = (updatedBookmarks) => {
    setBookmarkedPosts(updatedBookmarks || []);
  };

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_END_POINT}/bookmarks`, {
          withCredentials: true,
        });
        console.log("BOOKMARK API RESPONSE:", res.data);
        if (res.data.success) {
          setBookmarkedPosts(res.data.posts || []);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="w-[50%] border-l border-r border-gray-200 bg-gray-100 
      shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] rounded-2xl 
      max-h-[90vh] overflow-y-scroll scrollbar-hide">

      <div className="p-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Bookmarked Posts</h2>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 p-4">Loading bookmarks...</p>
      ) : bookmarkedPosts.length > 0 ? (
        bookmarkedPosts.map((post) => (
          <Xplorium
            key={post._id}
            Xplorium={post}
            onBookmarksUpdate={handleBookmarksUpdate}
          />
        ))
      ) : (
        <p className="text-center text-gray-400 p-4">No bookmarks yet</p>
      )}
    </div>
  );
};

export default Bookmarks;
