import Gallery from "./Gallery.jsx";
import Sidebar from "./Sidebar.jsx";
import SearchSidebar from './SearchSidebar.jsx';

const Body = (props) => {
    const
        {
            sidebarOpen, setSidebarOpen,
            searchOpen, setSearchOpen,
            searchQuery, setSearchQuery
        } = props;

    return (
        <div className="flex flex-1 overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />
            <SearchSidebar
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            <div className="flex-1 overflow-y-auto px-5 pb-5">
                <Gallery searchQuery={searchQuery} />
            </div>
        </div>
    );
}

export default Body;