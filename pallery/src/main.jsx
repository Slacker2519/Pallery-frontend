import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import PostPainting from "./pages/PostPainting.jsx";
import Profile from "./pages/Profile.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import NotFound from "./components/NotFound.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import CreateAlbum from "./pages/CreateAlbum.jsx";
import AlbumPage from "./pages/AlbumPage.jsx";
import EditAlbum from "./pages/EditAlbum.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/profile/paintings/post", element: <PostPainting /> },
  { path: "/users/:id", element: <Profile /> },
  { path: "/profile", element: <Profile /> },
  { path: "/profile/update", element: <UpdateProfile /> },
  { path: "/profile/albums/create", element: <CreateAlbum /> },
  { path: "/profile/albums/:id", element: <AlbumPage /> },
  { path: "/profile/albums/:id/edit", element: <EditAlbum /> },
  { path: "*", element: <NotFound /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
