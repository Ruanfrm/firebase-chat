// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SignIn from "./pages/SignIn";
import Privete from "./routes/privete" 
import Chat from "./components/Chat"
import SignUp from './pages/SignUp';
import Terms from './pages/Terms';
import Politics from './pages/Politics';
import Error404 from './pages/Error404'


const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn/>,
  },
  {
    path: "/criar-conta",
    element: <SignUp/>,
  },
  {
    path: "/chat",
    element: <Privete><Chat/></Privete>,
  },
  {
    path: "/terms",
    element: <Terms/>,
  },
  {
    path: "/politics",
    element: <Politics/>,
  },
  {
    path: "*",
    element: <Error404/>,
  },
 
]);

export {router};
