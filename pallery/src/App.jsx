import { useState } from "react";
import { useTheme } from "./context/ThemeContext.js";
import Header from "./components/Header";
import Body from "./components/Body";
import { useAuthModal } from "./context/AuthModalContext.js";

function App() {
  const { toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { openAuth } = useAuthModal();

  return (
    <div className="w-full min-h-screen bg-light text-black dark:text-light dark:bg-dark flex flex-col">
      <Header
        onLoginClick={() => openAuth()}
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
      />
    </div>
  );
}

export default App;
