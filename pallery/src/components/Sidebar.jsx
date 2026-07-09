import Overlay from "./Overlay.jsx";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Sidebar = (props) => {
  const { isOpen, onClose, onProtectedNav } = props;
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToPost = () => {
    if (user) {
      navigate("/post");
    } else {
      onProtectedNav();
    }
  };

  const goToProfile = () => {
    if (user) {
      navigate("/profile");
    } else {
      onProtectedNav();
    }
  };

  return (
    <div>
      {isOpen && (
        <div>
          <Overlay zIndex="z-20" onClick={onClose} />
        </div>
      )}
      <aside
        className={`
                sidebar left-0 md:w-1/5 transform-animation
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="mb-2">
          <button className="ml-5 mt-3" onClick={onClose}>
            <i className="fa-solid fa-bars text-xl xl:text-2xl"></i>
          </button>
        </div>

        <div className="bg-light dark:bg-offDark">
          <button
            onClick={() => navigate("/")}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <FaHome className="text-2xl" />
            <span className="text-xl">Home</span>
          </button>

          <button
            onClick={goToPost}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <FaFolderPlus className="text-xl" />
            <span className="text-xl">Create</span>
          </button>

          <button
            onClick={goToProfile}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <FaUser className="text-xl" />
            <span className="text-xl">Profile</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
