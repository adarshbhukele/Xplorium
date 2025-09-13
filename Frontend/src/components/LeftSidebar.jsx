  import React from 'react';
  import { FaHome, FaUser, FaBookmark } from "react-icons/fa";
  import { IoMdLogOut } from "react-icons/io";
  import { Link, useNavigate } from 'react-router-dom';
  import { useSelector, useDispatch } from "react-redux";
  import axios from "axios";
  import { USER_API_END_POINT } from '../utils/constant';
  import toast from "react-hot-toast";
  import { getMyProfile, getOtherUsers, getUser } from '../redux/userSlice';
  import { setIsCreatingPost } from "../redux/XploriumSlice";
  

  const LeftSidebar = () => {
    const { user } = useSelector(store => store.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const logoutHandler = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/logout`);
        dispatch(getUser(null));
        dispatch(getOtherUsers(null));
        dispatch(getMyProfile(null));
        navigate('/login');
        toast.success(res.data.message);
      } catch (error) {
        console.log(error);
      }
    };

    // Only allow post creation if user is logged in
    const handlePostClick = () => {
      if (!user?._id) return; // Prevent if not logged in
      navigate("/post");
      setTimeout(() => dispatch(setIsCreatingPost(true)), 0);
    };

    return (
      <div className="w-[20%]">
        <div className="flex flex-col items-start p-5 rounded-3xl bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-lg border border-gray-200 h-[90vh]">
          {/* Logo */}
          <div className="mb-8 w-full flex justify-center">
            <img
              className="drop-shadow-md rounded-xl"
              width={120}
              src="/xploeium--logo.png"
              alt="Xplorium"
            />
          </div>

          {/* Navigation Links */}
          <div className="w-full space-y-4">
            <Link
              to="/"
              onClick={() => dispatch(setIsCreatingPost(false))}
              className="flex items-center px-5 py-3 rounded-2xl bg-white shadow-md border border-gray-100 hover:bg-blue-50 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <FaHome size="22px" className="text-[#7638FA]" />
              <h1 className="font-semibold text-base ml-3">Home</h1>
            </Link>

            <Link

              to={`/profile/${user?._id}`}
                
              onClick={() => dispatch(setIsCreatingPost(false))}
              
              className="flex items-center px-5 py-3 rounded-2xl bg-white shadow-md border border-gray-100 hover:bg-purple-50 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <FaUser size="22px" className="text-[#D300C5]" />
              <h1 className="font-semibold text-base ml-3">Profile</h1>
            </Link>

            <Link
              to="/bookmarks"
              className="flex items-center px-5 py-3 rounded-2xl bg-white shadow-md border border-gray-100 hover:bg-pink-50 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <FaBookmark size="22px" className="text-[#FF0069]" />
              <h1 className="font-semibold text-base ml-3">Bookmarks</h1>
            </Link>

            <div
              onClick={logoutHandler}
              className="flex items-center px-5 py-3 rounded-2xl bg-white shadow-md border border-gray-100 hover:bg-orange-50 hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <IoMdLogOut size="22px" className="text-[#FF7A00]" />
              <h1 className="font-semibold text-base ml-3">Logout</h1>
            </div>
          </div>

          {/* Post Button */}
          <button
            onClick={handlePostClick}
            disabled={!user?._id}
            className={`mt-8 w-full px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 font-bold text-white text-lg shadow-md hover:from-blue-600 hover:to-pink-600 transition-all duration-200 cursor-pointer
              ${!user?._id ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Post
          </button>
        </div>
      </div>
    );
  };

  export default LeftSidebar;

