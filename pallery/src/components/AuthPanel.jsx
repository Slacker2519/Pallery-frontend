import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FiCamera } from "react-icons/fi";

const AuthPanel = (props) => {
  const { isLogin, onSwitch, onSuccess } = props;
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

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

    setError(null);
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (avatarFile) data.append("avatar", avatarFile);
        await register(data);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-in-out translate-y-[20vh]">
      <div className="bg-light dark:bg-dark border rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4 text-dark dark:text-light">
        <h2 className="text-lg font-medium text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
              <div className="flex flex-col items-center gap-1">
                <button
                    type="button"
                    onClick={handleAvatarClick}
                    aria-label="Choose a profile picture"
                    className="group relative block w-20 h-20 rounded-full overflow-hidden p-0
                    bg-dark text-light border border-light/40"
                >
                  {avatarPreview ? (
                      <>
                        <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                        <span
                            className="absolute inset-0 flex items-center justify-center bg-black/30
                            text-white/90 text-xl pointer-events-none transition-opacity
                            [@media(hover:hover)]:opacity-0
                            [@media(hover:hover)]:group-hover:opacity-100"
                        >
                          <FiCamera />
                        </span>
                      </>
                  ) : (
                      <span className="flex items-center justify-center w-full h-full text-2xl">
                        <FiCamera />
                      </span>
                  )}
                </button>

                <span className="text-xs text-gray-400">Profile picture (optional)</span>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
              </div>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border rounded-lg p-2 bg-transparent text-sm"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border rounded-lg p-2 bg-transparent text-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="border rounded-lg p-2 text-sm bg-violet-500 text-light"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={onSwitch}
            className="ml-1 text-violet-500 border-none bg-transparent"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPanel;
