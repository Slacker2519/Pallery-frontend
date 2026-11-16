import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api/user.js";
import Sidebar from "../components/Sidebar.jsx";
import { IoChevronBack } from "react-icons/io5";
import { FiCamera } from "react-icons/fi";

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchUser = async () => {
      try {
        const res = await getUser(user.id);
        setFormData((prev) => ({
          ...prev,
          name: res.user.name || "",
          email: res.user.email || "",
        }));
        setAvatarUrl(res.user.avatarUrl || "");
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.value = ""; // lets the same file be picked again
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile picture must be under 5 MB");
      return;
    }

    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    if (formData.password) data.append("password", formData.password);
    if (avatarFile) data.append("avatar", avatarFile);

    const res = await updateUser(user.id, data);

    setUser((prev) => ({
      ...prev,
      name: res.user.name,
      email: res.user.email,
      avatarUrl: res.user.avatarUrl,
    }));

    setAvatarUrl(res.user.avatarUrl || "");
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const inputClass =
    "w-full border rounded-lg p-2 bg-transparent text-sm focus:outline-none focus:border-violet-500";

  return (
    <div className="w-full min-h-screen dark:bg-dark dark:text-light bg-light text-black">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex justify-between items-center px-4 py-3">
        <button onClick={() => setSidebarOpen(true)}>
          <i className="fa-solid fa-bars text-xl" />
        </button>
        <button onClick={() => navigate("/profile")}>
          <IoChevronBack className="inline text-3xl" />
        </button>
      </div>

      <div className="px-6 pb-10 max-w-md">
        <h1 className="text-xl font-medium mb-6">Update Profile</h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 rounded-lg p-3">{error}</p>
        )}

        {success && (
          <p className="text-green-500 text-sm mb-4 border border-green-400 rounded-lg p-3">
            Profile updated successfully!
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="self-start">
            <button
                type="button"
                onClick={handleAvatarClick}
                aria-label="Change profile picture"
                className="group relative block w-16 h-16 rounded-full overflow-hidden p-0"
            >
              {avatarPreview || avatarUrl ? (
                  <img
                      src={avatarPreview || avatarUrl}
                      alt=""
                      className="w-full h-full object-cover"
                  />
              ) : (
                  <div className="w-full h-full bg-violet-500 flex items-center justify-center text-2xl text-white font-medium">
                    {formData.name?.charAt(0).toUpperCase()}
                  </div>
              )}

              <span
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white/90
                  text-xl pointer-events-none transition-opacity
                  [@media(hover:hover)]:opacity-0
                  [@media(hover:hover)]:group-hover:opacity-100"
              >
                <FiCamera />
              </span>
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
            />
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <hr className="border-gray-300 dark:border-gray-700" />

          <p className="text-xs text-gray-500">
            Leave password fields empty to keep current password
          </p>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Leave empty to keep current"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full border rounded-lg p-2 text-sm mt-2
              hover:bg-violet-500 hover:text-white hover:border-violet-500
              transition-colors duration-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
