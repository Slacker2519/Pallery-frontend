import { useState } from "react";
import Header from "./components/Header";
import Body from "./components/Body";

function App() {
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={`
                ${theme}
                w-full h-screen bg-light text-black dark:text-light dark:bg-dark
                flex flex-col
            `}
    >
      <Header
        onToggleDarkMode={() => {
          theme === "dark" ? setTheme("") : setTheme("dark");
        }}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleSearch={() => setSearchOpen(!searchOpen)}
        theme={theme}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
