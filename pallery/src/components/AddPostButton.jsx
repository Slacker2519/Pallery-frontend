import { FaPlus } from "react-icons/fa";

const AddPostButton = (props) => {
  const { onClick } = props;

  return (
    <button
      onClick={onClick}
      className="break-inside-avoid w-full mb-2 aspect-square bg-black/20 dark:bg-white/30 rounded-lg
              flex justify-center items-center text-3xl lg:text-7xl text-light hover:bg-black/30
              dark:hover:bg-white/20 transition-colors duration-200"
    >
      <FaPlus />
    </button>
  );
};

export default AddPostButton;
