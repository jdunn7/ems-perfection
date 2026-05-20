import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { stories } from "@/data/content";

const Stories = () => {
    const { locale, t } = useLanguage();
    return (
        <section
            id="stories"
            data-testid="stories-section"
            className="section-y bg-card/60"
        >
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
                    <div className="max-w-2xl">
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.stories.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.stories.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {t.stories.cursive}
                            </span>
                        </h2>
                        <p className="font-body text-muted-foreground mt-4 text-base">
                            {t.stories.sub}
                        </p>
                    </div>
                    <a
                        href="#stories"
                        data-testid="stories-view-all"
                        className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-foreground border-b border-foreground/70 pb-0.5 hover:text-accent hover:border-accent transition-colors"
                    >
                        {t.stories.viewAll}
                        <span className="inline-block w-5 h-px bg-current" />
                    </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {stories.map((s) => (
                        <article
                            key={s.id}
                            data-testid={`story-card-${s.id}`}
                            className="group bg-background rounded-3xl overflow-hidden flex flex-col"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden">
                                <img
                                    src={s.image}
                                    alt={s.titles[locale]}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                                />
                                <span className="absolute top-4 left-4 bg-white text-foreground font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full">
                                    {s.tag}
                                </span>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-body text-lg md:text-xl font-semibold leading-snug text-foreground">
                                    {s.titles[locale]}
                                </h3>
                                <div className="mt-auto pt-5">
                                    <a
                                        href="#stories"
                                        className="inline-flex items-center gap-2 text-sm font-body text-accent hover:gap-3 transition-all"
                                    >
                                        {locale === "es" ? "Leer más" : "Read more"}
                                        <ArrowUpRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stories;
