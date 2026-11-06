import { useState, useCallback } from "react";
import { AuthModalContext } from "./AuthModalContext";
import { useAuth } from "./AuthContext";
import AuthPanel from "../components/AuthPanel";

const AuthModalProvider = ({ children }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

    const openAuth = useCallback((mode) => {
        setIsLogin(mode !== "register");
        setIsOpen(true);
    }, []);

    const closeAuth = useCallback(() => setIsOpen(false), []);

    return (
        <AuthModalContext.Provider value={{ openAuth, closeAuth }}>
            {children}

            {isOpen && !user && (
                <>
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
                        onClick={closeAuth}
                    />
                    <div className="fixed inset-0 flex items-center justify-center z-[91] pointer-events-none">
                        <div className="pointer-events-auto">
                            <AuthPanel
                                isLogin={isLogin}
                                onSwitch={() => setIsLogin(!isLogin)}
                                onSuccess={closeAuth}
                            />
                        </div>
                    </div>
                </>
            )}
        </AuthModalContext.Provider>
    );
};

export default AuthModalProvider;