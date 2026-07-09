import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../api/user.js";
import Sidebar from "../components/Sidebar.jsx";
import { IoChevronBack } from "react-icons/io5";

const UpdateProfile = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const res = await updateUser(user.id, updateData);

      setUser((prev) => ({
        ...prev,
        name: res.user.name,
        email: res.user.email,
      }));

      setSuccess(true);
      setFormData((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <div className="flex items-center gap-4 mb-2">
            <div
              className="w-16 h-16 rounded-full bg-violet-500 flex items-center
              justify-center text-2xl text-white font-medium shrink-0"
            >
              {formData.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{formData.name}</p>
              <p className="text-xs text-gray-500">{formData.email}</p>
            </div>
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
