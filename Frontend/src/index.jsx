import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from './app/root.jsx';
import GameFunction from './app/game';
import ChangeCredentials from './accountsettings.jsx';
import StatsSection from './app/home';
import Friendlist from './app/managefriendlist';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
 
 const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/game",
    element: <GameFunction/>,
  },
  {
    path: "/home",
    element: <StatsSection/>,
  },
  {
    path:"/accountsettings",
    element: <ChangeCredentials/>,
  },
  {
    path:"/friends",
    element: <Friendlist/>,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);