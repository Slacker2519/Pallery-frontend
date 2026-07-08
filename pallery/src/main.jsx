import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Post from "./pages/painting/PostPainting.jsx";
import NotFound from "./components/NotFound.jsx";
import ThemeProvider from "./context/ThemeProvider.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/post", element: <Post /> }, // ✅ no more ProtectedRoute needed
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
