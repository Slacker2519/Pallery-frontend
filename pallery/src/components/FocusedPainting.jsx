import { useState, useEffect } from "react";
import PaintingDetailCard from "./PaintingDetailCard.jsx";
import { FaEllipsisH } from "react-icons/fa";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
};

const FocusedPainting = (props) => {
  const { painting: initialPainting, onUpdate, onDelete } = props;
  const [painting, setPainting] = useState(initialPainting);
  const [openDetail, setOpenDetail] = useState(false);
  const isMobile = useIsMobile();

  const handleUpdate = (updatedPainting) => {
    setPainting(updatedPainting);
    if (onUpdate) onUpdate(updatedPainting);
  };

  return (
    // container
    <div className="flex z-30 rounded-lg">
      {/* expandable panel*/}
      <div
        className="relative flex rounded-lg z-30 shadow-lg shadow-light/50 animate-zoomIn
          overflow-hidden transition-all duration-500 bg-light dark:bg-dark"
      >
        {/* left panel*/}
        <div className="shrink-0 rounded-lg p-2 md:p-3 bg-light h-full">
          <img
            src={painting.url}
            alt={painting.name}
            className="max-w-[80vw] md:max-w-[55vw] max-h-[80vh] object-contain"
          />

          <button
            className={`absolute top-1 md:top-3 right-4 md:right-6 rounded-full text-light
              ${openDetail ? "hidden" : ""}`}
            onClick={() => setOpenDetail(!openDetail)}
          >
            <FaEllipsisH
              strokeWidth={10}
              stroke="black"
              size={30}
              fill="white"
            />
          </button>
        </div>

        {/* right panel*/}
        {!isMobile && (
          <div
            className={`h-full shrink-0 overflow-hidden bg-light dark:bg-dark
              transition-all duration-500 overflow-y-auto rounded-xl border
              ${openDetail ? "w-[20vw] px-4 opacity-100 delay-100 ml-2" : "w-0 opacity-0 px-0"}`}
          >
            {openDetail && (
              <PaintingDetailCard
                isOpen={openDetail}
                onClose={() => setOpenDetail(false)}
                painting={painting}
                onUpdate={handleUpdate}
                onDelete={onDelete}
                isMobile={false}
              />
            )}
          </div>
        )}
      </div>

      {isMobile && (
        <div>
          <PaintingDetailCard
            isOpen={openDetail}
            onClose={() => setOpenDetail(false)}
            painting={painting}
            onUpdate={handleUpdate}
            onDelete={onDelete}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
};

export default FocusedPainting;
