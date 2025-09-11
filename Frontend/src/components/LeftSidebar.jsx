
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

  return (
    <div className="w-[20%] ">
      <div className="flex flex-col items-start p-4 rounded-2xl bg-gray-100 
        shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] h-[90vh]">

        {/* Logo */}
        <div className="mb-6 cursor-pointer">
          <img
            className="ml-3 drop-shadow-md"
            width={"130px"}
            src="../public/xploeium--logo.png"
            alt="Xplorium"
          />
        </div>

        {/* Navigation Links */}
        <div className="w-full space-y-3">
          <Link
            to="/"
            className="flex items-center px-4 py-3 rounded-full bg-gray-100
            shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
            hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
            transition-all duration-300 cursor-pointer"
          >
            <FaHome size="22px" className="text-[#7638FA]" />
            <h1 className="font-semibold text-md ml-3">Home</h1>
          </Link>

          <Link
            to={`/profile/${user?._id}`}
            className="flex items-center px-4 py-3 rounded-full bg-gray-100
            shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
            hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
            transition-all duration-300 cursor-pointer"
          >
            <FaUser size="22px" className="text-[#D300C5]" />
            <h1 className="font-semibold text-md ml-3">Profile</h1>
          </Link>

          <Link
          to="/bookmarks"
            className="flex items-center px-4 py-3 rounded-full bg-gray-100
            shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
            hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
            transition-all duration-300 cursor-pointer"
          >
            <FaBookmark size="22px" className="text-[#FF0069]" />
            <h1 className="font-semibold text-md ml-3">Bookmarks</h1>
          </Link>

          <div
            onClick={logoutHandler}
            className="flex items-center px-4 py-3 rounded-full bg-gray-100
            shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
            hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
            transition-all duration-300 cursor-pointer"
          >
            <IoMdLogOut size="22px" className="text-[#FF7A00]" />
            <h1 className="font-semibold text-md ml-3">Logout</h1>
          </div>
        </div>

        {/* Post Button */}
        <button
          onClick={() => dispatch(setIsCreatingPost(true))}
          className="mt-6 w-full px-5 py-3 rounded-full 
          bg-blue-400 font-bold text-gray-700
          shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
          hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
          active:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
          transition-all duration-300 cursor-pointer"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;

