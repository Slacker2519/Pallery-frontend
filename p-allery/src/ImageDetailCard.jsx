import Overlay from "./Overlay.jsx";

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
                p-3 transform-animation
                ${isOpen ? '-translate-y-0' : 'translate-y-[120%]'}
            `}>
                <div>{tags}</div>
                <div>{author}</div>
                <div>{description}</div>
            </aside>
        </div>
    );
}

export default ImageDetailCard;