import React from "react";
import { Instagram, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { artists } from "@/data/content";

const Artists = () => {
    const { locale, t } = useLanguage();

    const onBookWith = (artistKey) => {
        const el = document.getElementById("booking");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.dispatchEvent(new CustomEvent("browsems:select-artist", { detail: { artistKey } }));
    };

    return (
        <section id="artists" data-testid="artists-section" className="section-y bg-card/40">
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
                    <div className="max-w-2xl">
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.artists.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.artists.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {t.artists.cursive}
                            </span>
                        </h2>
                        <p className="font-body text-muted-foreground mt-4 text-base">{t.artists.sub}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {artists.map((a) => (
                        <article
                            key={a.key}
                            data-testid={`artist-card-${a.key}`}
                            className="group bg-background rounded-3xl overflow-hidden flex flex-col"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={a.image}
                                    alt={a.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                                <div className="absolute bottom-4 left-5 right-5 flex flex-wrap gap-2">
                                    {a.signature.map((s) => (
                                        <span
                                            key={s}
                                            className="bg-white/90 text-foreground text-[10px] font-body uppercase tracking-[0.2em] px-2.5 py-1 rounded-full"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="font-body text-xl font-semibold">{a.name}</h3>
                                <p className="font-heading text-accent text-2xl leading-none mt-1 -rotate-1 inline-block">
                                    {a.title[locale]}
                                </p>
                                <p className="font-body text-sm text-muted-foreground mt-4">
                                    {a.bio[locale]}
                                </p>
                                <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                                    <a
                                        href="#"
                                        aria-label={a.instagram}
                                        className="inline-flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        <Instagram size={14} />
                                        {a.instagram}
                                    </a>
                                    <button
                                        onClick={() => onBookWith(a.key)}
                                        data-testid={`artist-book-${a.key}`}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background text-xs font-body font-medium hover:bg-accent transition-colors"
                                    >
                                        {t.artists.bookCta} {a.name.split(" ")[0]}
                                        <ArrowUpRight size={12} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Artists;
