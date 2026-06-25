import SearchBar from "./SearchBar.jsx";

const SearchSidebar = (props) => {
    const { isOpen, onClose, searchQuery, setSearchQuery} = props;

    return (
        <div>
            <aside className={`
                sidebar right-0 transform-animation
                ${isOpen ? '-translate-x-0' : 'translate-x-full'}
            `}>
                <div>
                    <button
                        className="ml-5 mt-4"
                        onClick={onClose}>
                        <i className="fa-solid fa-arrow-left text-xl"></i>
                    </button>
                </div>
                <div className="flex flex-col justify-center items-center px-4 w-full">
                    <SearchBar
                        width="w-full" height="h-10"
                        value={searchQuery}
                        onChange={setSearchQuery}
                    />
                </div>
            </aside>
        </div>
    );
}

export default SearchSidebar;