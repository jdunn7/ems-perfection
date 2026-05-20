import React from "react";
import { Instagram, Facebook, Youtube, Heart } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { BRAND_LOGO_URL } from "@/data/content";

const Footer = () => {
    const { t } = useLanguage();
    const f = t.footer;

    return (
        <footer
            data-testid="site-footer"
            className="bg-foreground text-background pt-16 md:pt-24 pb-10"
        >
            <div className="container-x">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 border-b border-white/10">
                    <div className="md:col-span-4">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-background overflow-hidden">
                                <img
                                    src={BRAND_LOGO_URL}
                                    alt="BrowsEMS"
                                    className="w-9 h-9 object-cover"
                                />
                            </span>
                            <span className="font-heading text-3xl">BrowsEMS</span>
                        </div>
                        <p className="font-body text-background/70 text-sm max-w-xs">{f.tagline}</p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="#"
                                aria-label="Instagram"
                                data-testid="footer-instagram"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                            >
                                <Instagram size={16} />
                            </a>
                            <a
                                href="#"
                                aria-label="Facebook"
                                data-testid="footer-facebook"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                            >
                                <Facebook size={16} />
                            </a>
                            <a
                                href="#"
                                aria-label="YouTube"
                                data-testid="footer-youtube"
                                className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent flex items-center justify-center transition-colors"
                            >
                                <Youtube size={16} />
                            </a>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-body text-xs tracking-[0.3em] uppercase text-background/60 mb-4">
                            {f.shop}
                        </h4>
                        <ul className="space-y-2">
                            {f.links.shop.map((l) => (
                                <li key={l}>
                                    <a
                                        href="#best-sellers"
                                        className="font-body text-sm text-background/85 hover:text-accent transition-colors"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-body text-xs tracking-[0.3em] uppercase text-background/60 mb-4">
                            {f.help}
                        </h4>
                        <ul className="space-y-2">
                            {f.links.help.map((l) => (
                                <li key={l}>
                                    <a
                                        href="#contact"
                                        className="font-body text-sm text-background/85 hover:text-accent transition-colors"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-body text-xs tracking-[0.3em] uppercase text-background/60 mb-4">
                            {f.company}
                        </h4>
                        <ul className="space-y-2">
                            {f.links.company.map((l) => (
                                <li key={l}>
                                    <a
                                        href="#stories"
                                        className="font-body text-sm text-background/85 hover:text-accent transition-colors"
                                    >
                                        {l}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-2">
                        <h4 className="font-body text-xs tracking-[0.3em] uppercase text-background/60 mb-4">
                            {f.badge.split("·")[0].trim()}
                        </h4>
                        <p className="font-body text-sm text-background/85 leading-relaxed">
                            {f.badge}
                        </p>
                    </div>
                </div>

                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-body text-xs text-background/60">{f.rights}</p>
                    <p className="font-body text-xs text-background/60 flex items-center gap-1.5">
                        Made with <Heart size={12} className="text-accent fill-accent" /> for everyday princesses
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
