import { useState } from "react";
import { useTheme } from "./context/ThemeContext.js";
import { useAuth } from "./context/AuthContext.js";
import Header from "./components/Header";
import Body from "./components/Body";
import AuthPanel from "./components/AuthPanel.jsx";

function App() {
  const { toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleProtectedNav = () => {
    if (!user) {
      setShowAuth(true);
    }
  };

  return (
    <div className="w-full min-h-screen bg-light text-black dark:text-light dark:bg-dark flex flex-col">
      <Header
        onLoginClick={() => setShowAuth(true)}
        onProtectedNav={handleProtectedNav}
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

      {showAuth && !user && (
        <>
          <div
            className="fixed inset-0 bg-black/70 z-70"
            onClick={() => setShowAuth(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-80 pointer-events-none">
            <div className="pointer-events-auto">
              <AuthPanel
                isLogin={isLogin}
                onSwitch={() => setIsLogin(!isLogin)}
                onSuccess={() => setShowAuth(false)}
                onClose={() => setShowAuth(false)}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
