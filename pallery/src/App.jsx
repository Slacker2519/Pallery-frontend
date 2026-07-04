import { useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";
import { useTheme } from "./context/ThemeContext.js";

function App() {
  const { toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="w-full min-h-screen bg-light text-black dark:text-light dark:bg-dark flex flex-col">
      <Header
        onToggleDarkMode={toggleTheme}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleSearch={() => setSearchOpen(!searchOpen)}
        theme={isDark ? "dark" : ""}
        onSearch={setSearchQuery}
      />
      <Body
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}

export default App;
