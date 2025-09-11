
// // import React, { useState, useEffect } from 'react';
// // import { IoMdArrowBack } from "react-icons/io";
// // import { Link, useParams } from 'react-router-dom';
// // import Avatar from "react-avatar";
// // import { useSelector, useDispatch } from "react-redux";
// // import useGetProfile from '../hooks/UseGetProfile';
// // import axios from "axios";
// // import { USER_API_END_POINT, Xplorium_API_END_POINT } from '../utils/constant';
// // import toast from "react-hot-toast";
// // import { followingUpdate } from '../redux/userSlice';
// // import { getRefresh } from '../redux/XploriumSlice';
// // import Xplorium from "./Xplorium";

// // const Profile = () => {
// //     const { user, profile } = useSelector(store => store.user);
// //     const { id } = useParams();
// //     useGetProfile(id);
// //     const dispatch = useDispatch();

// //     const [editName, setEditName] = useState("");
// //     const [editUsername, setEditUsername] = useState("");
// //     const [editEmail, setEditEmail] = useState("");
// //     const [editBio, setEditBio] = useState("");
// //     const [editProfilePic, setEditProfilePic] = useState(null);
// //     const [editBannerPic, setEditBannerPic] = useState(null);
// //     const [openEdit, setOpenEdit] = useState(false);

// //     // 🔥 New State for user posts
// //     const [userPosts, setUserPosts] = useState([]);
// //     const [loadingPosts, setLoadingPosts] = useState(true);

// //     // Reset edit fields when switching profile
// //     useEffect(() => {
// //         setOpenEdit(false);
// //         setEditName("");
// //         setEditUsername("");
// //         setEditEmail("");
// //         setEditBio("");
// //         setEditProfilePic(null);
// //         setEditBannerPic(null);
// //     }, [id]);

// //     // 🔥 Fetch profile user's posts
// //     useEffect(() => {
// //         const fetchUserPosts = async () => {
// //             try {
// //                 setLoadingPosts(true);
// //                 const res = await axios.get(`${Xplorium_API_END_POINT}/user/${id}`, {
// //                     withCredentials: true
// //                 });
// //                 if (res.data.success) {
// //                     setUserPosts(res.data.posts);
// //                 }
// //             } catch (error) {
// //                 toast.error("Failed to load user posts");
// //             } finally {
// //                 setLoadingPosts(false);
// //             }
// //         };

// //         fetchUserPosts();
// //     }, [id, dispatch]);

// //     const followAndUnfollowHandler = async () => {
// //         try {
// //             axios.defaults.withCredentials = true;
// //             if (user.following.includes(id)) {
// //                 const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
// //                 dispatch(followingUpdate(id));
// //                 dispatch(getRefresh());
// //                 toast.success(res.data.message);
// //             } else {
// //                 const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
// //                 dispatch(followingUpdate(id));
// //                 dispatch(getRefresh());
// //                 toast.success(res.data.message);
// //             }
// //         } catch (error) {
// //             toast.error(error.response?.data?.message || "Something went wrong");
// //         }
// //     };

// //     const handleUpdate = async () => {
// //         try {
// //             const formData = new FormData();
// //             formData.append("name", editName || profile?.name);
// //             formData.append("username", editUsername || profile?.username);
// //             formData.append("email", editEmail || profile?.email);
// //             formData.append("bio", editBio || profile?.bio);
// //             if (editProfilePic) formData.append("profilePic", editProfilePic);
// //             if (editBannerPic) formData.append("bannerPic", editBannerPic);

// //             axios.defaults.withCredentials = true;
// //             const res = await axios.put(`${USER_API_END_POINT}/update/${user._id}`, formData, {
// //                 headers: { "Content-Type": "multipart/form-data" }
// //             });

// //             toast.success(res.data.message);
// //             setOpenEdit(false);
// //             dispatch(getRefresh());
// //         } catch (error) {
// //             toast.error(error.response?.data?.message || "Update failed");
// //         }
// //     };

// //     return (
// //         <div className="w-[50%] border-l border-r border-gray-200 bg-gray-100 
// //         shadow-[inset_8px_8px_16px_#d1d5db,inset_-8px_-8px_16px_#ffffff] rounded-2xl max-h-[90vh]
// //         scrollbar-hide overflow-y-scroll [&::-webkit-scrollbar]:hidden">

// //             {/* ---- Profile Info  ---- */}
// //             <div className="flex items-center py-3 px-4 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]">
// //                 <Link to="/" className="p-2 rounded-full bg-gray-100 shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]">
// //                     <IoMdArrowBack size="24px" />
// //                 </Link>
// //                 <div className="ml-3">
// //                     <h1 className="font-bold text-lg">{profile?.name}</h1>
// //                 </div>
// //             </div>

// //             <div className="relative">
// //   {/* Banner */}
// //   <img
// //     src={profile?.bannerPic || "/xploriumBG.png"}
// //     alt="banner"
// //     className="w-full h-48 object-cover"
// //     onError={(e) => { e.target.src = "/xploriumBG.png"; }}
// //   />

// //   {/* Avatar */}
// //   <div className="absolute -bottom-14 left-6 border-4 border-gray-100 rounded-full">
// //     <Avatar src={profile?.profilePic} size="120" round={true} />
// //   </div>
// // </div>


// //             <div className="text-right m-4">
// //                 {profile?._id === user?._id ? (
// //                     <button
// //                         onClick={() => {
// //                             setEditName(profile?.name || "");
// //                             setEditUsername(profile?.username || "");
// //                             setEditEmail(profile?.email || "");
// //                             setEditBio(profile?.bio || "");
// //                             setOpenEdit(true);
// //                         }}
// //                         className="px-6 py-2 bg-blue-400 rounded-full"
// //                     >
// //                         Edit Profile
// //                     </button>

// //                 ) : (
// //                     <button onClick={followAndUnfollowHandler} className="px-6 py-2 bg-blue-400 rounded-full">
// //                         {user.following.includes(id) ? "Following" : "Follow"}
// //                     </button>
// //                 )}
// //             </div>

// //             <div className="m-4 ml-10 mt-5">
// //                 <h1 className="font-bold text-xl ">{profile?.name}</h1>
// //                 <p className="text-gray-500">@{profile?.username}</p>
// //             </div>
// //             <div className="m-4 ml-10 text-md text-gray-700">
// //                 <p>{profile?.bio}</p>
// //             </div>

// //             {openEdit && (
// //                 <div className="p-6 space-y-4 bg-white shadow rounded-lg m-4">
// //                     {/* Name */}
// //                     <input
// //                         type="text"
// //                         placeholder="Name"
// //                         value={editName}
// //                         onChange={(e) => setEditName(e.target.value)}
// //                         className="w-full p-2 border rounded"
// //                     />

// //                     {/* Username */}
// //                     <input
// //                         type="text"
// //                         placeholder="Username"
// //                         value={editUsername}
// //                         onChange={(e) => setEditUsername(e.target.value)}
// //                         className="w-full p-2 border rounded"
// //                     />

// //                     {/* Email */}
// //                     <input
// //                         type="email"
// //                         placeholder="Email"
// //                         value={editEmail}
// //                         onChange={(e) => setEditEmail(e.target.value)}
// //                         className="w-full p-2 border rounded"
// //                     />

// //                     {/* Bio */}
// //                     <textarea
// //                         placeholder="Bio"
// //                         value={editBio}
// //                         onChange={(e) => setEditBio(e.target.value)}
// //                         className="w-full p-2 border rounded"
// //                     />

// //                     {/* Profile Pic Upload */}
// //                     <div>
// //                         <label className="block text-sm text-gray-600 mb-1">Profile Picture</label>
// //                         <input
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) => setEditProfilePic(e.target.files[0])}
// //                             className="w-full"
// //                         />
// //                     </div>

// //                     {/* Banner Pic Upload */}
// //                     <div>
// //                         <label className="block text-sm text-gray-600 mb-1">Banner Picture</label>
// //                         <input
// //                             type="file"
// //                             accept="image/*"
// //                             onChange={(e) => setEditBannerPic(e.target.files[0])}
// //                             className="w-full"
// //                         />
// //                     </div>

// //                     {/* Buttons */}
// //                     <div className="flex gap-4 mt-4">
// //                         <button
// //                             onClick={handleUpdate}
// //                             className="px-6 py-2 bg-blue-500 text-white rounded-lg"
// //                         >
// //                             Save
// //                         </button>
// //                         <button
// //                             onClick={() => setOpenEdit(false)}
// //                             className="px-6 py-2 bg-gray-300 rounded-lg"
// //                         >
// //                             Cancel
// //                         </button>
// //                     </div>
// //                 </div>
// //             )}

// //             {/* ---- User's Posts ---- */}
// //             <div className="mt-8 p-4 border-t border-gray-300">
// //                 <h2 className="text-lg font-semibold mb-4">Posts</h2>
// //                 {loadingPosts ? (
// //                     <p className="text-center text-gray-500">Loading posts...</p>
// //                 ) : userPosts.length > 0 ? (
// //                   userPosts.map((post) => (
// //   <Xplorium 
// //     key={post._id} 
// //     Xplorium={post} 
// //     onUpdate={(updated) => {
// //       setUserPosts((prev) =>
// //         prev.map((p) => (p._id === updated._id ? updated : p))
// //       );
// //     }}
// //     onDelete={(id) => {
// //       setUserPosts((prev) => prev.filter((p) => p._id !== id));
// //     }}
// //   />
// // ))
// //                 ) : (
// //                     <p className="text-center text-gray-400">No posts yet</p>
// //                 )}
// //             </div>
            

// //         </div>
// //     );
// // };

// // export default Profile;





// import React, { useState, useEffect } from 'react';
// import { IoMdArrowBack } from "react-icons/io";
// import { Link, useParams } from 'react-router-dom';
// import Avatar from "react-avatar";
// import { useSelector, useDispatch } from "react-redux";
// import useGetProfile from '../hooks/UseGetProfile';
// import axios from "axios";
// import { USER_API_END_POINT, Xplorium_API_END_POINT } from '../utils/constant';
// import toast from "react-hot-toast";
// import { followingUpdate } from '../redux/userSlice';
// import { getRefresh } from '../redux/XploriumSlice';
// import Xplorium from "./Xplorium";

// const Profile = () => {
//   const { user, profile } = useSelector(store => store.user);
//   const { id } = useParams();
//   useGetProfile(id);
//   const dispatch = useDispatch();

//   const [editName, setEditName] = useState("");
//   const [editUsername, setEditUsername] = useState("");
//   const [editEmail, setEditEmail] = useState("");
//   const [editBio, setEditBio] = useState("");
//   const [editProfilePic, setEditProfilePic] = useState(null);
//   const [editBannerPic, setEditBannerPic] = useState(null);
//   const [openEdit, setOpenEdit] = useState(false);

//   const [userPosts, setUserPosts] = useState([]);
//   const [loadingPosts, setLoadingPosts] = useState(true);

//   useEffect(() => {
//     setOpenEdit(false);
//     setEditName(""); setEditUsername(""); setEditEmail(""); setEditBio("");
//     setEditProfilePic(null); setEditBannerPic(null);
//   }, [id]);

//   useEffect(() => {
//     const fetchUserPosts = async () => {
//       try {
//         setLoadingPosts(true);
//         const res = await axios.get(`${Xplorium_API_END_POINT}/user/${id}`, { withCredentials: true });
//         if (res.data.success) setUserPosts(res.data.posts);
//       } catch { toast.error("Failed to load user posts"); }
//       finally { setLoadingPosts(false); }
//     };
//     fetchUserPosts();
//   }, [id, dispatch]);

//   const followAndUnfollowHandler = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       if (user.following.includes(id)) {
//         const res = await axios.post(`${USER_API_END_POINT}/unfollow/${id}`, { id: user?._id });
//         dispatch(followingUpdate(id)); dispatch(getRefresh());
//         toast.success(res.data.message);
//       } else {
//         const res = await axios.post(`${USER_API_END_POINT}/follow/${id}`, { id: user?._id });
//         dispatch(followingUpdate(id)); dispatch(getRefresh());
//         toast.success(res.data.message);
//       }
//     } catch { toast.error("Something went wrong"); }
//   };

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("name", editName || profile?.name);
//       formData.append("username", editUsername || profile?.username);
//       formData.append("email", editEmail || profile?.email);
//       formData.append("bio", editBio || profile?.bio);
//       if (editProfilePic) formData.append("profilePic", editProfilePic);
//       if (editBannerPic) formData.append("bannerPic", editBannerPic);

//       axios.defaults.withCredentials = true;
//       const res = await axios.put(`${USER_API_END_POINT}/update/${user._id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }
//       });

//       toast.success(res.data.message);
//       setOpenEdit(false);
//       dispatch(getRefresh());
//     } catch { toast.error("Update failed"); }
//   };

//   return (
//     <div className="w-[50%] max-h-[90vh] overflow-y-scroll bg-gray-100 rounded-2xl p-4 shadow-neumorphic [&::-webkit-scrollbar]:hidden">
      
//       {/* Header */}
//       <div className="flex items-center py-3 px-4 mb-6 shadow-neumorphic rounded-xl">
//         <Link to="/" className="p-2 rounded-full bg-gray-100 shadow-neumorphic">
//           <IoMdArrowBack size="24px" />
//         </Link>
//         <div className="ml-3"><h1 className="font-bold text-lg">{profile?.name}</h1></div>
//       </div>

//       {/* Banner & Avatar */}
//       <div className="relative mb-6">
//         <img
//           src={profile?.bannerPic || "/xploriumBG.png"}
//           alt="banner"
//           className="w-full h-48 object-cover rounded-xl shadow-neumorphic"
//           onError={(e) => { e.target.src = "/xploriumBG.png"; }}
//         />
//         <div className="absolute -bottom-14 left-6 border-4 border-gray-100 rounded-full shadow-neumorphic">
//           <Avatar src={profile?.profilePic} size="120" round />
//         </div>
//       </div>

//       {/* Follow/Edit Button */}
//       <div className="text-right mb-6">
//         {profile?._id === user?._id ? (
//           <button onClick={() => {
//             setEditName(profile?.name); setEditUsername(profile?.username);
//             setEditEmail(profile?.email); setEditBio(profile?.bio);
//             setOpenEdit(true);
//           }}
//             className="px-6 py-2 bg-gray-100 shadow-neumorphic rounded-full hover:shadow-neumorphic-inset transition">
//             Edit Profile
//           </button>
//         ) : (
//           <button onClick={followAndUnfollowHandler}
//             className="px-6 py-2 bg-gray-100 shadow-neumorphic rounded-full hover:shadow-neumorphic-inset transition">
//             {user.following.includes(id) ? "Following" : "Follow"}
//           </button>
//         )}
//       </div>

//       {/* Profile Info */}
//       <div className="ml-10 mb-4">
//         <h1 className="font-bold text-xl">{profile?.name}</h1>
//         <p className="text-gray-500">@{profile?.username}</p>
//         <p className="text-gray-700 mt-2">{profile?.bio}</p>
//       </div>

//       {/* Edit Profile */}
//       {openEdit && (
//         <div className="p-6 mb-6 bg-gray-100 rounded-2xl shadow-neumorphic space-y-4">
//           <input type="text" placeholder="Name" value={editName} onChange={e => setEditName(e.target.value)}
//             className="w-full p-2 rounded-xl shadow-neumorphic focus:shadow-neumorphic-inset outline-none" />
//           <input type="text" placeholder="Username" value={editUsername} onChange={e => setEditUsername(e.target.value)}
//             className="w-full p-2 rounded-xl shadow-neumorphic focus:shadow-neumorphic-inset outline-none" />
//           <input type="email" placeholder="Email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
//             className="w-full p-2 rounded-xl shadow-neumorphic focus:shadow-neumorphic-inset outline-none" />
//           <textarea placeholder="Bio" value={editBio} onChange={e => setEditBio(e.target.value)}
//             className="w-full p-2 rounded-xl shadow-neumorphic focus:shadow-neumorphic-inset outline-none" />
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Profile Picture</label>
//             <input type="file" accept="image/*" onChange={e => setEditProfilePic(e.target.files[0])} />
//           </div>
//           <div>
//             <label className="block text-sm text-gray-600 mb-1">Banner Picture</label>
//             <input type="file" accept="image/*" onChange={e => setEditBannerPic(e.target.files[0])} />
//           </div>
//           <div className="flex gap-4 mt-4">
//             <button onClick={handleUpdate} className="px-6 py-2 bg-gray-100 shadow-neumorphic rounded-full hover:shadow-neumorphic-inset transition">Save</button>
//             <button onClick={() => setOpenEdit(false)} className="px-6 py-2 bg-gray-100 shadow-neumorphic rounded-full hover:shadow-neumorphic-inset transition">Cancel</button>
//           </div>
//         </div>
//       )}

//       {/* User Posts */}
//       <div className="mt-8 p-4">
//         <h2 className="text-lg font-semibold mb-4">Posts</h2>
//         {loadingPosts ? (
//           <p className="text-center text-gray-500">Loading posts...</p>
//         ) : userPosts.length > 0 ? (
//           userPosts.map(post => (
//             <Xplorium
//               key={post._id}
//               Xplorium={post}
//               onUpdate={updated => setUserPosts(prev => prev.map(p => p._id === updated._id ? updated : p))}
//               onDelete={id => setUserPosts(prev => prev.filter(p => p._id !== id))}
//             />
//           ))
//         ) : (
//           <p className="text-center text-gray-400">No posts yet</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Profile;

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
    <div className="w-[50%] h-[90vh] overflow-y-scroll p-4 bg-gray-100 rounded-2xl
      shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] [&::-webkit-scrollbar]:hidden">

      {/* Header */}
      <div className="flex items-center px-4 py-3 mb-6 rounded-xl bg-gray-100 
        shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]">
        <Link to="/" className="p-2 rounded-full bg-gray-100 
          shadow-[4px_4px_8px_#d1d5db,-4px_-4px_8px_#ffffff]">
          <IoMdArrowBack size="24px" />
        </Link>
        <h1 className="ml-3 font-bold text-lg">{profile?.name}</h1>
      </div>

      {/* Banner */}
      <div className="relative mb-6">
        <img src={profile?.bannerPic || "/xploriumBG.png"} alt="banner"
          className="w-full h-48 object-cover rounded-xl 
            shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]"
          onError={(e) => e.target.src = "/xploriumBG.png"} />
        <div className="absolute -bottom-14 left-6 border-4 border-gray-100 rounded-full 
          ">
          <Avatar src={profile?.profilePic} size="120" round />
        </div>
      </div>

      {/* Follow/Edit Button */}
      <div className="text-right mb-6 ">
        {profile?._id === user?._id ? (
          <button onClick={() => {
            setEditName(profile?.name); setEditUsername(profile?.username);
            setEditEmail(profile?.email); setEditBio(profile?.bio);
            setOpenEdit(true);
          }}
            className="px-6 py-2 rounded-full bg-blue-400
              shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] 
              transition-all duration-300 cursor-pointer">
            Edit Profile
          </button>
        ) : (
          <button onClick={followAndUnfollowHandler}
            className="px-6 py-2 rounded-full bg-blue-400
              shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] 
              transition-all duration-300 cursor-pointer">
            {user.following.includes(id) ? "Following" : "Follow"}
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="ml-10 mb-4">
        <h1 className="font-bold text-xl">{profile?.name}</h1>
        <p className="text-gray-500">@{profile?.username}</p>
        <p className="text-gray-700 mt-2">{profile?.bio}</p>
      </div>

      {/* Edit Profile */}
      {openEdit && (
        <div className="p-6 mb-6 bg-gray-100 rounded-2xl 
          shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] space-y-4">
          <input type="text" placeholder="Name" value={editName} onChange={e => setEditName(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-100 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              focus:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] outline-none" />
          <input type="text" placeholder="Username" value={editUsername} onChange={e => setEditUsername(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-100 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              focus:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] outline-none" />
          <input type="email" placeholder="Email" value={editEmail} onChange={e => setEditEmail(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-100 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              focus:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] outline-none" />
          <textarea placeholder="Bio" value={editBio} onChange={e => setEditBio(e.target.value)}
            className="w-full p-2 rounded-xl bg-gray-100 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              focus:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] outline-none" />
          <div>
            <label className="block text-sm text-gray-600 mb-1 ">Profile Picture</label>
            <input className='border border-gray-300 w-[250px] bg-gray-400 p-2 rounded-md cursor-pointer' type="file" accept="image/*" onChange={e => setEditProfilePic(e.target.files[0])} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Banner Picture</label>
            <input className='border border-gray-300 w-[250px] bg-gray-400 p-2 rounded-md cursor-pointer' type="file" accept="image/*" onChange={e => setEditBannerPic(e.target.files[0])} />
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={handleUpdate}
              className="px-6 py-2 rounded-full bg-blue-400
                shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
                hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
                transition-all duration-300 cursor-pointer">Save</button>
            <button onClick={() => setOpenEdit(false)} 
              className="px-6 py-2 rounded-full bg-gray-100 text-blue-700
                shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
                hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
                transition-all duration-300 cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {/* User Posts */}
      <div className="mt-8 p-4 rounded-2xl shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff]">
        <h2 className="text-lg font-semibold mb-4">Posts</h2>
        {loadingPosts ? (
          <p className="text-center text-gray-500">Loading posts...</p>
        ) : userPosts.length > 0 ? (
          userPosts.map(post => (
            <Xplorium
              key={post._id}
              Xplorium={post}
              onUpdate={updated => setUserPosts(prev => prev.map(p => p._id === updated._id ? updated : p))}
              onDelete={id => setUserPosts(prev => prev.filter(p => p._id !== id))}
            />
          ))
        ) : (
          <p className="text-center text-gray-400">No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

