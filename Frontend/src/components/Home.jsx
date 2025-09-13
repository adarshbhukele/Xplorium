import React, { useEffect } from 'react'
import LeftSidebar from './LeftSidebar'
import RightSidebar from './RightSidebar'
import { Outlet, useNavigate } from "react-router-dom";
import UseOtherUsers from '../hooks/UseOtherUsers';
import { useSelector } from "react-redux";
import UseGetMyXplorium from '../hooks/UseGetMyXplorium';



const Home = () => {
  const { user, otherUsers } = useSelector(store => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Call custom hooks at the top level, not inside if/else or useEffect
  UseOtherUsers(user?._id);
  UseGetMyXplorium(user?._id);

  if (!user) {
    return <div>Loading...</div>
  }


  return (
    <div className='flex justify-between py-[3vh] w-[80%] mx-auto '>
      <LeftSidebar />
         
           <Outlet />
      <RightSidebar otherUsers={otherUsers} />
  
    </div>
  )
}

export default Home;