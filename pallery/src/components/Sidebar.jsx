import Overlay from "./Overlay.jsx";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { FaFolderPlus } from "react-icons/fa";

const Sidebar = (props) => {
  const { isOpen, onClose } = props;

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
          <Link to="/">
            <button className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full">
              <FaHome className="text-2xl" />
              <span className="text-xl">Home</span>
            </button>
          </Link>
          <Link to="/post">
            <button className="bg-light dark:bg-offDark flex justify-start items-center gap-4 pl-7 w-full">
              <FaFolderPlus className="text-xl" />
              <span className="text-xl">Create</span>
            </button>
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
