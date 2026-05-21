import React from "react";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { testimonials } from "@/data/content";

const Testimonials = () => {
    const { locale, t } = useLanguage();
    return (
        <section
            id="testimonials"
            data-testid="testimonials-section"
            className="section-y bg-foreground text-background"
        >
            <div className="container-x">
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                        {t.testimonials.kicker}
                    </span>
                    <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-background leading-[1.05]">
                        {t.testimonials.title}
                        <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                            {t.testimonials.cursive}
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                    {testimonials.map((tm) => (
                        <article
                            key={tm.id}
                            data-testid={`testimonial-${tm.id}`}
                            className="bg-white/[0.04] backdrop-blur-sm rounded-3xl p-7 lg:p-8 border border-white/10"
                        >
                            <Quote size={28} className="text-accent mb-4" />
                            <p className="font-body text-base text-background/90 leading-relaxed">
                                "{tm.text[locale]}"
                            </p>
                            <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/10">
                                <span className="font-body text-sm font-semibold text-background">
                                    {tm.name}
                                </span>
                                <span className="flex items-center gap-0.5">
                                    {Array.from({ length: tm.rating }).map((_, i) => (
                                        <Star key={i} size={14} className="fill-accent text-accent" />
                                    ))}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
