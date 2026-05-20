import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations, supportedLocales } from "./translations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [locale, setLocale] = useState(() => {
        if (typeof window === "undefined") return "en";
        const stored = window.localStorage.getItem("browsems_locale");
        if (stored && translations[stored]) return stored;
        return "en";
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem("browsems_locale", locale);
            document.documentElement.lang = locale;
        }
    }, [locale]);

    const value = useMemo(
        () => ({
            locale,
            setLocale,
            t: translations[locale],
            supportedLocales,
        }),
        [locale]
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
    return ctx;
};
