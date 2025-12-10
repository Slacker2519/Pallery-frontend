import Overlay from "./Overlay.jsx";
import TagCard from "./TagCard.jsx";

const ImageDetailCard = (props) => {
    const { isOpen, onClose, tags, author, description } = props;

    return (
        <div className="h-full">
            {isOpen && (
                <div className="md:hidden">
                    <Overlay zIndex="z-40" onClick={onClose} />
                </div>
            )}
            <aside className={`
                detail-card transform-animation
                ${isOpen ? 
                'translate-y-0 md:translate-x-[5%]' : 
                'translate-y-[120%] md:translate-y-0 md:-translate-x-[120%]'}
            `}>
                <button
                    className="hidden self-end md:inline rounded-full mb-3"
                    onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <div className="mb-3">Tags:
                    {tags.map((tag, index) =>
                        <TagCard key={index} children={tag} />
                    )}
                </div>
                <div className="mb-3">Author: {author}</div>
                <div className="mb-3">Description: {description}</div>
            </aside>
        </div>
    );
}

export default ImageDetailCard;