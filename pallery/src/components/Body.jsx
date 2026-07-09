import { useState } from "react";
import Gallery from "./Gallery.jsx";
import Sidebar from "./Sidebar.jsx";
import SearchSidebar from "./SearchSidebar.jsx";

const Body = (props) => {
  const {
    sidebarOpen,
    setSidebarOpen,
    searchOpen,
    setSearchOpen,
    searchQuery,
    onProtectedNav,
  } = props;

  const [searchSidebarQuery, setSearchSidebarQuery] = useState("");

  const activeQuery = searchQuery || searchSidebarQuery;

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onProtectedNav={onProtectedNav}
      />
      <SearchSidebar
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={setSearchSidebarQuery}
      />
      <div className="flex-1 overflow-y-auto px-5 pb-5">
        <Gallery searchQuery={activeQuery} />
      </div>
    </div>
  );
};

export default Body;
