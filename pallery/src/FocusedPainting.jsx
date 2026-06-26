import { useState } from "react";
import PaintingDetailCard from "./PaintingDetailCard.jsx";

const FocusedPainting = (props) => {
  const { painting } = props;
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <div className="focused-painting">
      <div className="focused-painting-container animate-zoomIn">
        <img
          src={painting.imageUrl}
          alt={painting.description}
          className="max-w-[80vw] md:max-w-[55vw] max-h-[80vh] object-contain"
        />
        <button
          className="absolute top-2 md:top-4 right-1 md:right-3 rounded-full"
          onClick={() => setOpenDetail(!openDetail)}
        >
          <i className="fa-solid fa-ellipsis-vertical text-xl md:text-2xl text-green-400"></i>
        </button>
      </div>
      {openDetail && (
        <div>
          <PaintingDetailCard
            isOpen={openDetail}
            onClose={() => setOpenDetail(false)}
            tags={painting.tag}
            author={painting.author}
            description={painting.description}
          />
        </div>
      )}
    </div>
  );
};

export default FocusedPainting;
