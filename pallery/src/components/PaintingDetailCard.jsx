import Overlay from "./Overlay.jsx";
import TagCard from "./TagCard.jsx";
import SafeLink from "./SafeLink.jsx";
import { FaPen } from "react-icons/fa";

const PaintingDetailCard = (props) => {
  const { isOpen, onClose, painting, isMobile = false } = props;

  return (
    <div className="h-full">
      {isOpen && (
        <div className="md:hidden">
          <Overlay zIndex="z-40" onClick={onClose} />
        </div>
      )}
      <aside
        className={
          isMobile
            ? `detail-card transform-animation ${isOpen ? "translate-y-0" : "translate-y-[120%]"}`
            : "flex flex-col p-2 overflow-y-auto w-full h-full rounded-xl"
        }
      >
        <div className="flex justify-between items-center mb-3">
          <button className="hidden md:inline rounded-sm">
            <FaPen />
          </button>

          <button className="hidden md:inline rounded-sm" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex mb-4 items-center">
          <div className="mr-1">Name: </div>
          <SafeLink href={painting.source}>{painting.name}</SafeLink>
        </div>

        <div className="flex items-center mb-4">
          {painting.tags && (
            <div>
              Tags:
              {painting.tags.map((tag) => (
                <TagCard key={tag} children={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center mb-3">
          <div className="mr-1">Author: </div>
          <SafeLink href={painting.authorUrl}>{painting.author}</SafeLink>
        </div>

        <div className="flex items-center mb-1">
          {painting.description && (
            <div>Description: {painting.description}</div>
          )}
        </div>

        <div>
          Uploaded:{" "}
          {new Date(painting.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </aside>
    </div>
  );
};

export default PaintingDetailCard;
