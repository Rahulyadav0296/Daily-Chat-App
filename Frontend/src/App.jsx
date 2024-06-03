import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SetAvatar from "./components/SetAvatar";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Chat />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "setAvatar",
    element: <SetAvatar />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
