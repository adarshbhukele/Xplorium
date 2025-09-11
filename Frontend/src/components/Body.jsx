import React from 'react';
import { Outlet } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './Login';
import Home from './Home';
import Feed from './Feed';
import Profile from './Profile';
import Bookmarks from './Bookmarks';

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
                }
            ]
        },
        {
            path: "/login",
            element: <Login />
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter} />


        </div>
    )
}

export default Body