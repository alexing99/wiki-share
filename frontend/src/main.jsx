import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Feed from "./pages/Feed";
import Profile from "./pages/UserPage";
import PostCreator from "./pages/PostCreatePage";
import About from "./pages/About.jsx";
import { UserProvider } from "./UserContext.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Feed />,
  },
  { path: "/auth", element: <App /> },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "feed",
    element: <Feed />,
  },
  {
    path: "feed/:redPostId", // path for being redirected to newly created roots
    element: <Feed />,
  },
  {
    path: "post",
    element: <PostCreator />,
  },
  {
    path: "about",
    element: <About />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
