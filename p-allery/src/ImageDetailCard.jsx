import Overlay from "./Overlay.jsx";
import TagCard from "./TagCard.jsx";

const ImageDetailCard = (props) => {
    const { isOpen, onClose, tags, author, description } = props;

    return (
        <div>
            {isOpen && (
                <div>
                    <Overlay zIndex="z-40" onClick={onClose} />
                </div>
            )}
            <aside className={`
                fixed bottom-0 fixed left-1/2 -translate-x-1/2 flex flex-col mb-3
                w-5/6 h-2/4 bg-light dark:bg-dark rounded-lg overflow-y-auto z-50
                p-4 transform-animation
                ${isOpen ? '-translate-y-0' : 'translate-y-[120%]'}
            `}>
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