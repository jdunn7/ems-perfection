import React, { useEffect, useState } from "react";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
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
        { key: "shop", href: "#best-sellers", label: t.nav.shop },
        { key: "collections", href: "#categories", label: t.nav.collections },
        { key: "stories", href: "#stories", label: t.nav.stories },
        { key: "book", href: "#booking", label: t.nav.book },
    ];

    return (
        <header
            data-testid="site-nav"
            className={`sticky top-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-background/85 backdrop-blur-md border-b border-border/70 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                    : "bg-background/40 backdrop-blur-[2px] border-b border-transparent"
            }`}
        >
            <div className="container-x flex items-center justify-between h-[68px]">
                {/* Logo */}
                <a href="#top" className="flex items-center gap-2" data-testid="nav-logo">
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

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-8">
                    {navLinks.map((l) => (
                        <a
                            key={l.key}
                            href={l.href}
                            data-testid={`nav-link-${l.key}`}
                            className="font-body text-sm text-foreground/80 hover:text-accent transition-colors tracking-wide uppercase"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Lang toggle */}
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

                    <button
                        aria-label="Search"
                        data-testid="nav-search-btn"
                        className="p-2 rounded-full hover:bg-card transition-colors hidden sm:inline-flex"
                    >
                        <Search size={18} />
                    </button>

                    <button
                        aria-label={t.nav.cart}
                        data-testid="nav-cart-btn"
                        className="relative p-2 rounded-full hover:bg-card transition-colors"
                    >
                        <ShoppingBag size={18} />
                        <span className="absolute -top-0.5 -right-0.5 bg-accent text-[10px] text-white w-4 h-4 rounded-full flex items-center justify-center font-medium">
                            0
                        </span>
                    </button>

                    {/* Mobile menu toggle */}
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

            {/* Mobile dropdown */}
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
