export const glowBorder = (state) => {
    if (state === "dirty") {
        return "border-red-500 shadow-[0_0_14px_rgba(239,68,68,0.55)]";
    }
    if (state === "success") {
        return "border-green-500 shadow-[0_0_14px_rgba(34,197,94,0.55)]";
    }
    return "border-dark dark:border-light";
};