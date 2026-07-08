import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const AuthPanel = (props) => {
  const { isLogin, onSwitch, onSuccess, onClose } = props;
  const { login, register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
      } else {
        await register(formData);
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
      <div className="bg-light dark:bg-dark border rounded-lg shadow-lg p-6 w-80 flex flex-col gap-4">
        <h2 className="text-lg font-medium text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-xl p-2 bg-transparent text-sm"
              required
            />
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
            className="border rounded-lg p-2 text-sm"
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
