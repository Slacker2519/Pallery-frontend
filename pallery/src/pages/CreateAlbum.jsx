import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { FaPaintBrush } from "react-icons/fa";

const CreateAlbum = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="w-full min-h-screen bg-light dark:bg-dark text-dark dark:text-light
        flex flex-col justify-center items-center scroll-auto"
    >
      {/* <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="w-full flex justify-start px-4 py-3 border border-green-500">
        <button onClick={() => setIsSidebarOpen(true)}>
          <i className="fa-solid fa-bars text-xl" />
        </button>
      </div>

      <div className="border-2 border-red-500 w-full m-5 flex-1 flex justify-center items-center">
        <div className="bg-offLight dark:bg-offDark p-5 rounded-lg">
          <div className="flex gap-3">
            <div className="border border-red-500 p-3 ">
              <FaPaintBrush />
            </div>

            <div className="flex flex-col">
              <div>Name</div>
              <div>Visibility</div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-600" />

      <div className="border-2 border-blue-500 w-full flex-1">
        <h1>Display paintings can add into album</h1>
      </div>*/}
    </div>
  );
};

export default CreateAlbum;
