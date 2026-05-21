import React, { useEffect, useState } from "react";
import { Calendar, Menu, X } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { BRAND_LOGO_URL } from "@/data/content";

const Nav = () => {
    const { locale, setLocale, t, supportedLocales } = useLanguage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLinks = [
        { key: "services", href: "/#services", label: t.nav.services },
        { key: "artists", href: "/#artists", label: t.nav.artists },
        { key: "gallery", href: "/#gallery", label: t.nav.gallery },
        { key: "process", href: "/#process", label: t.nav.process },
        { key: "faq", href: "/#faq", label: t.nav.faq },
    ];

    return (
        <header
            data-testid="site-nav"
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-background/85 backdrop-blur-md border-b border-border/70"
                    : "bg-background/40 backdrop-blur-[2px] border-b border-transparent"
            }`}
        >
            <div className="container-x flex items-center justify-between h-[68px]">
                <a href="/" className="flex items-center gap-2" data-testid="nav-logo">
                    <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-foreground overflow-hidden ring-1 ring-foreground/30">
                        <img
                            src={BRAND_LOGO_URL}
                            alt="BrowsEMS"
                            className="w-9 h-9 object-cover"
                            loading="eager"
                        />
                    </span>
                    <span className="font-heading text-2xl text-foreground leading-none">
                        BrowsEMS
                    </span>
                </a>

                <nav className="hidden lg:flex items-center gap-7">
                    {navLinks.map((l) => (
                        <a
                            key={l.key}
                            href={l.href}
                            data-testid={`nav-link-${l.key}`}
                            className="font-body text-[12px] text-foreground/80 hover:text-accent transition-colors tracking-[0.18em] uppercase"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div
                        className="hidden sm:flex items-center rounded-full border border-border bg-white/70 p-0.5"
                        data-testid="lang-toggle"
                    >
                        {supportedLocales.map((l) => (
                            <button
                                key={l.code}
                                onClick={() => setLocale(l.code)}
                                data-testid={`lang-btn-${l.code}`}
                                className={`px-3 py-1 text-xs font-body font-medium rounded-full transition-colors ${
                                    locale === l.code
                                        ? "bg-foreground text-background"
                                        : "text-foreground/70 hover:text-foreground"
                                }`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>

                    <a
                        href="/#booking"
                        data-testid="nav-book-cta"
                        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background font-body text-sm font-medium hover:bg-accent transition-colors"
                    >
                        <Calendar size={14} />
                        {t.nav.book}
                    </a>

                    <button
                        aria-label="Menu"
                        data-testid="nav-mobile-toggle"
                        className="lg:hidden p-2 rounded-full hover:bg-card transition-colors"
                        onClick={() => setMobileOpen((v) => !v)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div
                    data-testid="mobile-menu"
                    className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md"
                >
                    <nav className="container-x py-4 flex flex-col gap-2">
                        {navLinks.map((l) => (
                            <a
                                key={l.key}
                                href={l.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-2 py-3 font-body text-base text-foreground hover:bg-card rounded-xl transition-colors"
                                data-testid={`mobile-link-${l.key}`}
                            >
                                {l.label}
                            </a>
                        ))}
                        <a
                            href="/#booking"
                            onClick={() => setMobileOpen(false)}
                            className="mt-2 px-4 py-3 rounded-2xl bg-foreground text-background font-body text-base font-medium inline-flex items-center gap-2 justify-center"
                            data-testid="mobile-book-cta"
                        >
                            <Calendar size={16} />
                            {t.nav.book}
                        </a>
                        <div className="flex items-center gap-2 pt-2">
                            {supportedLocales.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setLocale(l.code)}
                                    data-testid={`mobile-lang-${l.code}`}
                                    className={`px-4 py-1.5 text-xs font-body font-medium rounded-full ${
                                        locale === l.code
                                            ? "bg-foreground text-background"
                                            : "bg-card text-foreground/80"
                                    }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Nav;
