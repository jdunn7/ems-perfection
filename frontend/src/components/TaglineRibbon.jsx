import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const TaglineRibbon = () => {
    const { t } = useLanguage();
    return (
        <section
            data-testid="tagline-ribbon"
            className="relative py-14 md:py-20 bg-primary/40 overflow-hidden"
        >
            <div className="container-x relative z-10 text-center">
                <p className="font-heading text-3xl sm:text-5xl lg:text-6xl text-primary-foreground leading-tight max-w-4xl mx-auto">
                    {t.ribbon}
                    <span className="ml-2">✨</span>
                </p>
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
                <div className="absolute -bottom-10 -right-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl" />
            </div>
        </section>
    );
};

export default TaglineRibbon;
