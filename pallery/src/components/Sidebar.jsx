import Overlay from "./Overlay.jsx";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext.js";
import { BiSolidPhotoAlbum } from "react-icons/bi";

const Sidebar = (props) => {
  const { isOpen, onClose } = props;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openAuth } = useAuthModal();

  const goProtected = (path) => {
    onClose();
    if (!user) {
      openAuth();
      return;
    }
    navigate(path);
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
            onClick={() => {
              onClose();
              navigate("/");
            }}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <FaHome className="text-2xl" />
            <span className="text-xl">Home</span>
          </button>

          <button
            onClick={() => goProtected("/profile")}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <FaUser className="text-xl" />
            <span className="text-xl">Profile</span>
          </button>

          <button
            onClick={() => goProtected("/profile/paintings/post")}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <FaFolderPlus className="text-xl" />
            <span className="text-xl">Post Painting</span>
          </button>

          <button
            onClick={() => goProtected("/profile/albums/create")}
            className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full hover:text-violet-500 rounded-none"
          >
            <BiSolidPhotoAlbum className="text-xl" />
            <span className="text-xl">Create Album</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
