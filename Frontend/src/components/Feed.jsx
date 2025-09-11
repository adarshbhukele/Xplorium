
import React, { useEffect } from 'react'
import CreatePost from './CreatePost.jsx'
import Xplorium from './Xplorium.jsx'
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Xplorium_API_END_POINT } from "../utils/constant";
import { getAllXploriums } from "../redux/XploriumSlice";

const Feed = () => {
  const { Xploriums } = useSelector(store => store.Xplorium);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${Xplorium_API_END_POINT}/all`, {
          withCredentials: true
        });
        if (res.data.success) {
          dispatch(getAllXploriums(res.data.posts));
        }
      } catch (error) {
        console.error("❌ Failed to fetch posts", error);
      }
    };

    fetchPosts();
  }, [dispatch]);

  return (
    <div className="w-[50%] h-[90vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden 
      bg-gray-100 rounded-2xl shadow-inner p-4 border border-gray-200">
      
      {/* Create Post Section */}
      <div className="mb-6 p-4 rounded-2xl bg-gray-100 shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]">
        <CreatePost />
      </div>

      {/* Posts Section */}
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
      </div>
    </div>
  )
}

export default Feed