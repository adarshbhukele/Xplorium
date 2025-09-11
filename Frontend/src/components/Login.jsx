import React, { useState } from 'react';
import axios from "axios";
import { USER_API_END_POINT } from "../utils/constant";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUser } from '../redux/userSlice';
import { getRefresh } from '../redux/XploriumSlice';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // login
      try {
        const res = await axios.post(`${USER_API_END_POINT}/login`, { email, password }, {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        });
        dispatch(getUser(res?.data?.user));
        dispatch(getRefresh());
        if (res.data.success) {
          navigate("/");
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      }
    } else {
      // signup
      try {
        const res = await axios.post(`${USER_API_END_POINT}/register`, { name, username, email, password }, {
          headers: { 'Content-Type': "application/json" },
          withCredentials: true
        });
        if (res.data.success) {
          setIsLogin(true);
          toast.success(res.data.message);
          dispatch(getRefresh());
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed");
      }
    }
  };

  const loginSignupHandler = () => setIsLogin(!isLogin);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-200">
      {/* Card Container */}
      <div className="bg-blue-100 rounded-3xl shadow-[12px_12px_24px_#cbd5e1,-12px_-12px_24px_#ffffff] 
        flex flex-col md:flex-row items-center justify-center p-10 md:p-16 w-[95%] max-w-3xl">

        {/* Logo Section */}
        <div className="hidden md:flex flex-col items-center mr-12">
          <img className="mb-4 drop-shadow-lg" width={180} src="../public/logo.png" alt="Xplorium-logo" />
        </div>

        {/* Form Section */}
        <div className="flex flex-col items-center w-full md:w-[350px]">
          <h1 className="mb-6 text-2xl font-bold text-gray-800">
            {isLogin ? "Login to your account" : "Create your account"}
          </h1>

          <form onSubmit={submitHandler} className="flex flex-col w-full gap-4">
            {!isLogin && (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="px-5 py-3 rounded-xl bg-gray-100 
                  shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
                  focus:shadow-[inset_3px_3px_6px_#d1d5db,inset_-3px_-3px_6px_#ffffff]
                  outline-none font-medium text-gray-700 placeholder-gray-400 transition"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="px-5 py-3 rounded-xl bg-gray-100 
                  shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
                  focus:shadow-[inset_3px_3px_6px_#d1d5db,inset_-3px_-3px_6px_#ffffff]
                  outline-none font-medium text-gray-700 placeholder-gray-400 transition"
                />
              </>
            )}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="px-5 py-3 rounded-xl bg-gray-100 
              shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
              focus:shadow-[inset_3px_3px_6px_#d1d5db,inset_-3px_-3px_6px_#ffffff]
              outline-none font-medium text-gray-700 placeholder-gray-400 transition"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="px-5 py-3 rounded-xl bg-gray-100 
              shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
              focus:shadow-[inset_3px_3px_6px_#d1d5db,inset_-3px_-3px_6px_#ffffff]
              outline-none font-medium text-gray-700 placeholder-gray-400 transition"
            />

            {/* Submit Button */}
            <button
              className="py-3 mt-2 rounded-xl font-bold text-lg text-gray-800 
             shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff] 
              hover:shadow-[inset_6px_6px_12px_purple,inset_-6px_-6px_12px_blue] 
              active:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
              transition-all duration-300 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 cursor-pointer"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>

            <h1 className="text-center text-gray-600 mt-2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                onClick={loginSignupHandler}
                className="font-bold text-blue-600 cursor-pointer hover:underline"
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </h1> 
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
