import Overlay from "./Overlay.jsx";
import TagCard from "./TagCard.jsx";
import SafeLink from "./SafeLink.jsx";

const PaintingDetailCard = (props) => {
  const { isOpen, onClose, painting } = props;

  return (
    <div className="h-full">
      {isOpen && (
        <div className="md:hidden">
          <Overlay zIndex="z-40" onClick={onClose} />
        </div>
      )}
      <aside
        className={`
                detail-card transform-animation
                ${
                  isOpen
                    ? "translate-y-0 md:translate-x-[5%]"
                    : "translate-y-[120%] md:translate-y-0 md:-translate-x-[120%]"
                }
            `}
      >
        <button
          className="hidden self-end md:inline rounded-full mb-3"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="flex mb-4">
          <div className="mr-1">Name: </div>
          <SafeLink href={painting.source}>{painting.name}</SafeLink>
        </div>

        <div className="flex mb-4">
          {painting.tags && (
            <div>
              Tags:
              {painting.tags.map((tag) => (
                <TagCard key={tag} children={tag} />
              ))}
            </div>
          )}
        </div>

        <div className="flex mb-3">
          <div className="mr-1">Author: </div>
          <SafeLink href={painting.authorUrl}>{painting.author}</SafeLink>
        </div>

        <div className="flex mb-1">
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
