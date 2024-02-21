import React from "react";
import { useState } from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Blog from "./pages/Blog";
import Classes from "./components/Classes";
import Import from "./pages/Import";
import Timetable from "./pages/Timetable";
// import Schedule from "./pages/Schedule";
import ClassesCRUD from "./pages/ClassesCRUD";

import Navbar from "./components/Navbar";
import App from "./App";

import App2 from "./App";
import Protected from "./pages/Protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App2 />,
    children: [
      {
        path: "/dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/blog",
        element: <Blog />,
      },
      {
        path: "/classes",
        element: <Classes />,
      },
      {
        path: "/import",
        element: <Import />,
      },
      {
        path: "/timetable",
        element: <Timetable />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
    ],
  },
]);

export default router;
