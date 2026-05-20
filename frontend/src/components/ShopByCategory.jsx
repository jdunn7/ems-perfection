import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { categories } from "@/data/content";

const ShopByCategory = () => {
    const { t } = useLanguage();
    const items = t.categories.items;

    return (
        <section
            id="categories"
            data-testid="categories-section"
            className="section-y bg-background"
        >
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
                    <div>
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.categories.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.categories.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {t.categories.cursive}
                            </span>
                        </h2>
                    </div>
                    <a
                        href="#best-sellers"
                        data-testid="categories-shop-all"
                        className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-foreground border-b border-foreground/70 pb-0.5 hover:text-accent hover:border-accent transition-colors"
                    >
                        {t.categories.shopAll}
                        <span className="inline-block w-5 h-px bg-current" />
                    </a>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {items.map((cat, i) => (
                        <a
                            key={cat.name}
                            href="#best-sellers"
                            data-testid={`category-tile-${categories[i].key}`}
                            className="category-tile group"
                        >
                            <img
                                src={categories[i].image}
                                alt={cat.name}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                            <div className="relative z-10 p-5 w-full">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h3 className="font-body text-white text-xl sm:text-2xl font-semibold leading-tight">
                                            {cat.name}
                                        </h3>
                                        <p className="font-body text-white/80 text-xs mt-1 max-w-[12rem]">
                                            {cat.desc}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-white/90 text-foreground w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                                        <ArrowUpRight size={16} />
                                    </span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ShopByCategory;
