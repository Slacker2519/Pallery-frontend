import { useState } from "react";
import { FiPlusCircle } from "react-icons/fi";

const AnimatedPanel = (props) => {
  const { onUpload } = props;
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="hidden lg:flex absolute left-1/2 top-1
        -translate-x-1/2 translate-y-1/2 items-center"
    >
      <div
        className={`flex h-[50vh] rounded-xl bg-offDark overflow-hidden transition-all duration-500
          shadow-lg shadow-light/50 border border-dark dark:border-light
          ${expanded ? "w-[50vw]" : "justify-center items-center w-[35vw]"}`}
      >
        <div
          className={`flex h-full
            ${expanded ? "w-[70%]" : "justify-center items-center w-full"}`}
        >
          <button
            onClick={() => {
              setExpanded(!expanded);
              onUpload;
            }}
            className={`rounded-full text-8xl`}
          >
            <FiPlusCircle />
          </button>
        </div>

        <div
          className={`overflow-hidden bg-offDark transition-all duration-500
            ${expanded ? "flex-1 border-l opacity-100 delay-100 px-3" : "w-0 opacity-0 px-0"}`}
        ></div>
      </div>
    </div>
  );
};

export default AnimatedPanel;
