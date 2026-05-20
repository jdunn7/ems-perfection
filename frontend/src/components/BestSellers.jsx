import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { products } from "@/data/content";
import { toast } from "sonner";

const BestSellers = () => {
    const { locale, t } = useLanguage();

    const onAdd = (p) => {
        toast.success(`${p.names[locale]} — ${locale === "es" ? "añadido a la bolsa" : "added to bag"} ✨`);
    };

    return (
        <section
            id="best-sellers"
            data-testid="best-sellers-section"
            className="section-y bg-background"
        >
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
                    <div>
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.bestSellers.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.bestSellers.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {t.bestSellers.cursive}
                            </span>
                            <span className="ml-1">💕</span>
                        </h2>
                    </div>
                    <a
                        href="#categories"
                        data-testid="best-sellers-shop-all"
                        className="hidden sm:inline-flex items-center gap-2 font-body text-sm text-foreground border-b border-foreground/70 pb-0.5 hover:text-accent hover:border-accent transition-colors"
                    >
                        {t.bestSellers.shopAll}
                        <span className="inline-block w-5 h-px bg-current" />
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {products.map((p) => (
                        <article
                            key={p.id}
                            data-testid={`product-card-${p.slug}`}
                            className="product-card group"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                                <img
                                    src={p.image}
                                    alt={p.names[locale]}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                            </div>
                            <div className="px-1.5 pt-4 pb-3 flex flex-col flex-1">
                                <h3 className="font-body text-base sm:text-lg font-semibold text-foreground">
                                    {p.names[locale]}
                                </h3>
                                <p className="font-body text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {p.descs[locale]}
                                </p>
                                <p className="font-body text-xs text-muted-foreground mt-2 italic">
                                    {p.variants[locale]}
                                </p>

                                <div className="mt-4 flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => onAdd(p)}
                                        data-testid={`add-to-bag-${p.slug}`}
                                        className="btn-bag"
                                    >
                                        <span>{t.bestSellers.addToBag}</span>
                                        <span className="sep" />
                                        <span>{p.price}</span>
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

export default BestSellers;
