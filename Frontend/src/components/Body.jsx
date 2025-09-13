import React from 'react';
import { Outlet } from "react-router-dom";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import Bookmarks from './Bookmarks';
import CreatePost from './CreatePost';

const Body = () => {
    const appRouter = createBrowserRouter([
        {
            path: "/",
            element: <Home />,
            children: [
                {
                    index: true,
                    element: <Feed />
                }, {
                    path: "/bookmarks",
                    element: <Bookmarks />
                },
                {
                    path: "profile/:id",
                    element: <Profile />
                },{
                    path: "/post",
                    element: <CreatePost />
                }
            ]
        },
        {
            path: "/login",
            element: <Login />
        }
    ])
    // Render the main app layout with Outlet for child routes
    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50">
            {/* You can add a header, nav, or global notifications here if needed */}
            <RouterProvider router={appRouter} />
            <Outlet />
            {/* You can add a global footer here if needed */}
        </div>
    );
}

export default Body