import { Link } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import SearchBar from "./SearchBar.jsx";

const Header = (props) => {
  const {
    onToggleDarkMode,
    theme,
    onToggleSidebar,
    onToggleSearch,
    searchQuery,
    setSearchQuery,
  } = props;

  return (
    <div className="header">
      <button onClick={onToggleSidebar}>
        <i className="fa-solid fa-bars text-xl xl:text-2xl"></i>
      </button>

      <SearchBar
        isHidden={true}
        width="w-xl"
        height="h-10"
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <div className="flex items-center gap-2">
        <Link to="/post">
          <button
            className="hidden lg:flex flex-wrap flex-row rounded-full items-center gap-2
          text-light border border-dark dark:border-light bg-violet-500"
          >
            <FaPlus />
            <div>Add Post</div>
          </button>
        </Link>

        <button className="hidden md:inline-block">
          <i className="fa-solid fa-user text-2xl"></i>
        </button>

        <button onClick={onToggleSearch} className="md:hidden">
          <i className="fa-solid fa-magnifying-glass text-xl mt-2"></i>
        </button>

        <Link to="/post">
          <button className="md:hidden text-dark dark:text-light">
            <i className="fa-solid fa-plus text-2xl"></i>
          </button>
        </Link>

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
