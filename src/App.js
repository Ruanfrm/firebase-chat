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
  
 
]);

export {router};
