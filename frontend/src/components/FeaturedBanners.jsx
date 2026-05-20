import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { featuredImages, products } from "@/data/content";
import { toast } from "sonner";

const FeaturedBanners = () => {
    const { locale, t } = useLanguage();
    const banners = t.featured;

    const featuredProduct = products[1]; // Crown Brow Pomade
    const featuredProduct2 = products[0]; // Velvet Lip Lacquer

    const onAdd = (p) => {
        toast.success(`${p.names[locale]} — ${locale === "es" ? "añadido a la bolsa" : "added to bag"} ✨`);
    };

    const renderBanner = (b, i, reversed) => (
        <section
            key={i}
            data-testid={`featured-banner-${i}`}
            className={`relative bg-card rounded-[28px] overflow-hidden`}
        >
            <div className={`grid grid-cols-1 md:grid-cols-2 ${reversed ? "md:[direction:rtl]" : ""}`}>
                <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[480px] overflow-hidden [direction:ltr]">
                    <img
                        src={featuredImages[i]}
                        alt={b.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-transparent" />
                    <span className="absolute top-6 left-6 bg-white/90 text-foreground font-body text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 rounded-full">
                        {b.eyebrow}
                    </span>
                </div>

                <div className="relative p-8 md:p-14 flex flex-col justify-center gap-5 [direction:ltr]">
                    <span className="font-heading text-accent text-4xl md:text-6xl leading-none -rotate-2 inline-block">
                        {b.cursive}
                    </span>
                    <h3 className="font-body text-foreground text-2xl md:text-4xl font-semibold leading-tight">
                        {b.title}
                    </h3>
                    <p className="font-body text-muted-foreground text-base max-w-md">
                        {b.copy}
                    </p>

                    {/* Inline product card */}
                    <div className="mt-2 flex items-center gap-4 bg-background/70 rounded-2xl p-3 max-w-md">
                        <img
                            src={(i === 0 ? featuredProduct : featuredProduct2).image}
                            alt=""
                            className="w-20 h-20 rounded-xl object-cover"
                            loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="font-body text-sm font-semibold truncate">
                                {(i === 0 ? featuredProduct : featuredProduct2).names[locale]}
                            </p>
                            <p className="font-body text-xs text-muted-foreground truncate">
                                {(i === 0 ? featuredProduct : featuredProduct2).variants[locale]}
                            </p>
                            <button
                                onClick={() => onAdd(i === 0 ? featuredProduct : featuredProduct2)}
                                data-testid={`featured-add-${i}`}
                                className="btn-bag mt-2"
                            >
                                <span>{t.bestSellers.addToBag}</span>
                                <span className="sep" />
                                <span>{(i === 0 ? featuredProduct : featuredProduct2).price}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <section className="section-y bg-background">
            <div className="container-x space-y-8 md:space-y-12">
                {banners.map((b, i) => renderBanner(b, i, i % 2 === 1))}
            </div>
        </section>
    );
};

export default FeaturedBanners;
