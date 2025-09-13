import React, { useState, useEffect } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import Avatar from "react-avatar";
import { useSelector, useDispatch } from "react-redux";
import useGetProfile from '../hooks/UseGetProfile';
import axios from "axios";
import { USER_API_END_POINT, Xplorium_API_END_POINT } from '../utils/constant';
import toast from "react-hot-toast";
import { followingUpdate } from '../redux/userSlice';
import { getRefresh } from '../redux/XploriumSlice';
import Xplorium from "./Xplorium";

const Profile = () => {
  const { user, profile } = useSelector(store => store.user);
  const { id } = useParams();
  useGetProfile(id);
  const dispatch = useDispatch();

  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editProfilePic, setEditProfilePic] = useState(null);
  const [editBannerPic, setEditBannerPic] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    setOpenEdit(false);
    setEditName(""); setEditUsername(""); setEditEmail(""); setEditBio("");
    setEditProfilePic(null); setEditBannerPic(null);
  }, [id]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await axios.get(`${Xplorium_API_END_POINT}/user/${id}`, { withCredentials: true });
        if (res.data.success) setUserPosts(res.data.posts);
      } catch { toast.error("Failed to load user posts"); }
      finally { setLoadingPosts(false); }
    };
    fetchUserPosts();
  }, [id, dispatch]);

  const followAndUnfollowHandler = async () => {
    try {
      axios.defaults.withCredentials = true;
      if (user.following.includes(id)) {
        const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
        dispatch(followingUpdate(id)); dispatch(getRefresh());
        toast.success(res.data.message);
      } else {
        const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
        dispatch(followingUpdate(id)); dispatch(getRefresh());
        toast.success(res.data.message);
      }
    } catch { toast.error("Something went wrong"); }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editName || profile?.name);
      formData.append("username", editUsername || profile?.username);
      formData.append("email", editEmail || profile?.email);
      formData.append("bio", editBio || profile?.bio);
      if (editProfilePic) formData.append("profilePic", editProfilePic);
      if (editBannerPic) formData.append("bannerPic", editBannerPic);

      axios.defaults.withCredentials = true;
      const res = await axios.put(`${USER_API_END_POINT}/update/${user._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success(res.data.message);
      setOpenEdit(false);
      dispatch(getRefresh());
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[90vh] overflow-y-scroll p-0 bg-white rounded-3xl shadow-lg border border-gray-200 [&::-webkit-scrollbar]:hidden">
      {/* Banner */}
      <div className="relative w-full h-56 bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 rounded-t-3xl ">
        <img
          src={profile?.bannerPic || "/xploriumBG.png"}
          alt="banner"
          className="w-full h-full object-cover object-center"
          onError={e => { e.target.onerror = null; e.target.src = "/xploriumBG.png"; }}
        />
        {/* Avatar - always in front and centered */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-1/2 z-30 flex justify-center w-full">
          <div className="flex  justify-center w-full">
            <Avatar
              src={profile?.profilePic}
              size="150"
              round
              className="shadow-2xl border-2 border-white bg-white"
              onError={e => { e.target.onerror = null; e.target.src = ""; }}
            />
          </div>
        </div>
      </div>

      {/* Floating Profile Card */}
      <div className="relative z-20 flex flex-col items-center mt-20 mb-6 px-6">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 px-8 py-6 w-full flex flex-col items-center">
          <h1 className="font-extrabold text-2xl text-gray-900 mb-1">{profile?.name}</h1>
          <p className="text-gray-500 text-base mb-2">@{profile?.username}</p>
          <p className="text-gray-700 text-center mb-4 whitespace-pre-line">{profile?.bio}</p>
          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-gray-900">{userPosts.length}</span>
              <span className="text-xs text-gray-500">Posts</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-gray-900">{profile?.followers?.length || 0}</span>
              <span className="text-xs text-gray-500">Followers</span>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg text-gray-900">{profile?.following?.length || 0}</span>
              <span className="text-xs text-gray-500">Following</span>
            </div>
          </div>
          {profile?._id === user?._id ? (
            <button onClick={() => {
              setEditName(profile?.name); setEditUsername(profile?.username);
              setEditEmail(profile?.email); setEditBio(profile?.bio);
              setOpenEdit(true);
            }}
              className="px-8 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow hover:from-blue-600 hover:to-pink-600 transition-all duration-200 text-lg mb-2">
              Edit Profile
            </button>
          ) : (
            <button onClick={followAndUnfollowHandler}
              className={`px-8 py-2 rounded-full font-bold text-lg shadow transition-all duration-200 mb-2 ${user.following.includes(id)
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-white'
                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:from-blue-600 hover:to-pink-600'}`}
            >
              {user.following.includes(id) ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {openEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="p-8 bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-center text-gray-800">Edit Profile</h2>
            <input type="text" placeholder="Name" value={editName} onChange={e => setEditName(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-gray-100 border border-gray-200 shadow focus:border-blue-400 outline-none text-lg" />
            <input type="text" placeholder="Username" value={editUsername} onChange={e => setEditUsername(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-gray-100 border border-gray-200 shadow focus:border-blue-400 outline-none text-lg" />
            <input type="email" placeholder="Email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-gray-100 border border-gray-200 shadow focus:border-blue-400 outline-none text-lg" />
            <textarea placeholder="Bio" value={editBio} onChange={e => setEditBio(e.target.value)}
              className="w-full p-3 mb-3 rounded-xl bg-gray-100 border border-gray-200 shadow focus:border-blue-400 outline-none text-lg resize-none" />
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1 font-semibold">Profile Picture</label>
              <input className='w-full p-2 rounded-xl bg-gray-100 border border-gray-200 cursor-pointer' type="file" accept="image/*" onChange={e => setEditProfilePic(e.target.files[0])} />
            </div>
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1 font-semibold">Banner Picture</label>
              <input className='w-full p-2 rounded-xl bg-gray-100 border border-gray-200 cursor-pointer' type="file" accept="image/*" onChange={e => setEditBannerPic(e.target.files[0])} />
            </div>
            <div className="flex gap-4 mt-4 justify-center">
              <button onClick={handleUpdate}
                className="px-8 py-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold shadow hover:from-blue-600 hover:to-pink-600 transition-all duration-200 text-lg">Save</button>
              <button onClick={() => setOpenEdit(false)}
                className="px-8 py-2 rounded-full bg-gray-100 text-blue-700 font-bold shadow border border-gray-200 hover:bg-blue-50 transition-all duration-200 text-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* User Posts Grid */}
      <div className="mt-8 px-6 pb-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Posts</h2>
        {loadingPosts ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : userPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {userPosts.map(post => (
              <div key={post._id} className="aspect-square bg-gray-100 rounded-2xl shadow-md overflow-hidden group cursor-pointer relative">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={post.images[0]}
                    alt="Post"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                    <span>No Image</span>
                  </div>
                )}
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-lg font-bold">View</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

