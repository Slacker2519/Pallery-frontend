import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import SearchBar from "./SearchBar.jsx";
import { useAuth } from "../context/AuthContext";

const Header = (props) => {
  const {
    onToggleDarkMode,
    theme,
    onToggleSidebar,
    onToggleSearch,
    onSearch,
    onLoginClick,
    onProtectedNav,
  } = props;

  const [inputValue, setInputValue] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToPost = () => {
    if (user) {
      navigate("/post");
    } else {
      onProtectedNav();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch(inputValue);
    }
  };

  return (
    <div className="header">
      <button onClick={onToggleSidebar}>
        <i className="fa-solid fa-bars text-xl xl:text-2xl"></i>
      </button>

      <SearchBar
        isHidden={true}
        width="w-xl"
        height="h-10"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-2">
        <button
          onClick={goToPost}
          className="hidden lg:flex flex-wrap flex-row rounded-full items-center gap-2
          text-light border border-dark dark:border-light bg-violet-500"
        >
          <FaPlus />
          <div>Add Post</div>
        </button>

        <button className="hidden md:inline-block">
          <i className="fa-solid fa-user text-2xl"></i>
        </button>

        <button onClick={onToggleSearch} className="md:hidden">
          <i className="fa-solid fa-magnifying-glass text-xl mt-2"></i>
        </button>

        <button
          onClick={goToPost}
          className="md:hidden text-dark dark:text-light"
        >
          <i className="fa-solid fa-plus text-2xl"></i>
        </button>

        <button className="icon" onClick={onToggleDarkMode}>
          {theme === "dark" ? (
            <FiMoon className="text-3xl" />
          ) : (
            <FiSun className="text-3xl" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;
