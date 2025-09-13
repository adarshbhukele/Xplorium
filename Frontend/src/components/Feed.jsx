import React, { useEffect } from 'react'
import CreatePost from './CreatePost.jsx'
import Xplorium from './Xplorium.jsx'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Xplorium_API_END_POINT } from "../utils/constant";
import { getAllXploriums, setIsCreatingPost } from "../redux/XploriumSlice";
import { useLocation } from "react-router-dom";

const Feed = () => {
  const { Xploriums, isCreatingPost } = useSelector(store => store.Xplorium);
  const { user } = useSelector(store => store.user);
  const dispatch = useDispatch();
  const location = useLocation();

  // Always fetch posts when Home is loaded, user changes, or after login/logout
  useEffect(() => {
    if (!user?._id) {
      dispatch(getAllXploriums([])); // Clear posts on logout
      return;
    }
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${Xplorium_API_END_POINT}/all`, {
          withCredentials: true
        });
        if (res.data.success) {
          dispatch(getAllXploriums(res.data.posts));
        } else {
          dispatch(getAllXploriums([]));
        }
      } catch (error) {
        dispatch(getAllXploriums([]));
        console.error("❌ Failed to fetch posts", error);
      }
    };
    fetchPosts();

    // Hide CreatePost when navigating to Home
    if (location.pathname === "/") {
      dispatch(setIsCreatingPost(false));
    }
  }, [dispatch, user?._id, location.pathname]);

  return (
    <div className="w-[50%] h-[90vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden 
      bg-gray-100 rounded-2xl shadow-inner p-4 border border-gray-200">
      
      {/* Show only CreatePost when isCreatingPost is true */}
      {isCreatingPost ? (
        <CreatePost />
      ) : (
        // Only show Xplorium posts on Home, hide CreatePost
        location.pathname === "/" && (
          <div className="space-y-6">
            {Xploriums?.map((post) => (
              <div
                key={post?._id}
                className="rounded-2xl p-4 bg-gray-100 
                shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]
                hover:shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] 
                transition-all duration-300"
              >
                <Xplorium Xplorium={post} />
              </div>
            ))}
            {Xploriums?.length === 0 && (
              <div className="text-center text-gray-400 py-10 text-lg">
                No posts to show.
              </div>
            )}
          </div>
        )
      )}
    </div>
  )
}

export default Feed