import Overlay from "./Overlay.jsx";

const Sidebar = (props) => {
    const { isOpen, onClose} = props;

    return (
        <div>
            {isOpen && (
                <div onClick={onClose}>
                    <Overlay />
                </div>
            )}
            <aside className={`
                sidebar left-0 md:w-1/5 transform-animation
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div>
                    <button
                        className="ml-5 mt-3"
                        onClick={onClose}>
                        <i className="fa-solid fa-bars text-xl xl:text-2xl"></i>
                    </button>
                </div>
            </aside>
        </div>
    );
}

export default Sidebar;