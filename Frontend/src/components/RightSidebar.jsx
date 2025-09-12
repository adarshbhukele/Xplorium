import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import Avatar from "react-avatar";
import { Link } from 'react-router-dom';

const RightSidebar = ({ otherUsers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(otherUsers || []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(otherUsers);
    } else {
      const filtered = otherUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, otherUsers]);

  return (
    <div className="w-[25%] h-[90vh] flex flex-col">
      {/* Search bar */}
      <div className="flex items-center px-4 py-2 mb-4 rounded-full bg-white shadow-md border border-gray-200 h-[8%]">
        <CiSearch size="20px" className="text-gray-400" />
        <input
          type="text"
          className="bg-transparent outline-none px-2 w-full text-gray-700 placeholder-gray-400 text-base"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Suggestions */}
      <div className="flex-1 p-4 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-3xl shadow-lg border border-gray-200 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
        <h1 className="font-bold text-xl mb-4 text-gray-700">Suggestions</h1>

        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              className="flex items-center justify-between my-3 p-3 rounded-2xl bg-white shadow-md border border-gray-100 hover:bg-blue-50 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center">
                <Avatar
                  src={user?.profilePic || undefined}
                  name={user?.name}
                  size="44"
                  round={true}
                  className="shadow"
                />
                <div className="ml-3">
                  <h1 className="font-semibold text-gray-800 text-base">{user?.name}</h1>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>
              </div>
              <Link to={`/profile/${user?._id}`}>
                <button
                  className="px-5 py-1 rounded-full font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow hover:from-blue-600 hover:to-pink-600 transition-all duration-200 cursor-pointer text-sm"
                >
                  Profile
                </button>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-2">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
