import React from "react";
import { Instagram } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { instagramImages } from "@/data/content";

const InstagramFeed = () => {
    const { t } = useLanguage();
    return (
        <section data-testid="instagram-section" className="bg-background pt-10 md:pt-16">
            <div className="container-x mb-8 md:mb-10 text-center">
                <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                    {t.instagram.kicker}
                </span>
                <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                    {t.instagram.title}
                    <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                        {t.instagram.cursive}
                    </span>
                </h2>
                <p className="font-body text-muted-foreground mt-3 text-sm max-w-2xl mx-auto">
                    {t.instagram.sub}
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-0">
                {instagramImages.map((url, idx) => (
                    <a
                        key={idx}
                        href="#"
                        data-testid={`instagram-tile-${idx}`}
                        className="group relative aspect-square overflow-hidden"
                    >
                        <img
                            src={url}
                            alt={`Instagram ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                            <Instagram
                                size={28}
                                className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
};

export default InstagramFeed;
