import { useCallback, useState } from "react";

export const useMissingFieldFlash = () => {
    const [flashing, setFlashing] = useState([]);

    const flash = useCallback((names) => {
        if (names.length === 0) return;

        const target = [...document.querySelectorAll(`[data-field="${names[0]}"]`)].find(
            (el) => el.getClientRects().length > 0,
        );
        target?.focus();

        setFlashing([]);
        requestAnimationFrame(() => setFlashing(names));
    }, []);

    const flashClass = (name) => (flashing.includes(name) ? "field-flash" : "");

    const onFlashEnd = (name) =>
        setFlashing((current) => current.filter((n) => n !== name));

    return { flash, flashClass, onFlashEnd };
};