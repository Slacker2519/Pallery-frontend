import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { login as loginApi, register as registerApi } from "../api/user";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const register = async (data) => {
    const res = await registerApi(data);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
  };

  const login = async (data) => {
    const res = await loginApi(data);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
