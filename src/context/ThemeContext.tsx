import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
    theme: Theme;
    toggleTheme: () => void;
    setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getInitialTheme(): Theme {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;

    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

    function setTheme(t: Theme) {
        setThemeState(t);
    }

    function toggleTheme() {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");


        localStorage.setItem("theme", theme);
    }, [theme]);

    const value = useMemo(
        () => ({ theme, toggleTheme, setTheme }),
        [theme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme deve ser usado dentro de ThemeProvider");
    return ctx;
}
