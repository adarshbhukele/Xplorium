
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
    <div className="w-[25%] h-[90vh]">
      {/* Search bar */}
      <div className="flex items-center px-4 py-2 mb-4 rounded-full bg-gray-100 
        shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff ] h-[8%] ">
        <CiSearch size="20px" className="text-gray-500" />
        <input
          type="text"
          className="bg-transparent outline-none px-2 w-full text-gray-700 placeholder-gray-400"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Suggestions */}
      <div className="p-4 bg-gray-100 rounded-2xl 
        shadow-[8px_8px_16px_#d1d5db,-8px_-8px_16px_#ffffff] overflow-y-scroll [&::-webkit-scrollbar]:hidden h-[90%]">
        <h1 className="font-bold text-lg mb-3 text-gray-700">Suggestions</h1>

        {filteredUsers?.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user?._id}
              className="flex items-center justify-between my-3 p-2 rounded-xl 
              bg-gray-100 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
              hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] 
              transition-all duration-300"
            >
              <div className="flex items-center">
                <Avatar
                  src={user?.profilePic || undefined}
                  name={user?.name}
                  size="40"
                  round={true}
                  className="shadow-md"
                />
                <div className="ml-3">
                  <h1 className="font-semibold text-gray-800">{user?.name}</h1>
                  <p className="text-sm text-gray-500">{`@${user?.username}`}</p>
                </div>
              </div>
              <Link to={`/profile/${user?._id}`}>
                <button
                  className="px-4 py-1 rounded-full font-medium text-gray-700 
                  bg-blue-400 shadow-[6px_6px_12px_#d1d5db,-6px_-6px_12px_#ffffff]
                  hover:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff] 
                  active:shadow-[inset_6px_6px_12px_#d1d5db,inset_-6px_-6px_12px_#ffffff]
                  transition-all duration-300 cursor-pointer"
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
