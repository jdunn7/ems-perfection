import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const FAQ = () => {
    const { t } = useLanguage();
    const [open, setOpen] = useState(0);
    const items = t.faq.items;

    return (
        <section id="faq" data-testid="faq-section" className="section-y bg-background">
            <div className="container-x">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12">
                    <div className="md:col-span-4">
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.faq.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.faq.title}
                        </h2>
                        <p className="font-heading text-accent text-4xl lg:text-5xl leading-none mt-3 -rotate-2 inline-block">
                            {t.faq.cursive}
                        </p>
                    </div>
                    <div className="md:col-span-8">
                        <ul className="space-y-3">
                            {items.map((it, i) => {
                                const isOpen = open === i;
                                return (
                                    <li
                                        key={i}
                                        data-testid={`faq-item-${i}`}
                                        className={`bg-card rounded-2xl overflow-hidden transition-all`}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setOpen(isOpen ? -1 : i)}
                                            className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                                            data-testid={`faq-toggle-${i}`}
                                        >
                                            <span className="font-body text-base sm:text-lg font-semibold text-foreground">
                                                {it.q}
                                            </span>
                                            <span className="flex-none w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center transition-transform">
                                                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                            </span>
                                        </button>
                                        <div
                                            className={`grid transition-all duration-500 ease-out ${
                                                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="px-6 pb-6 font-body text-sm text-muted-foreground max-w-2xl">
                                                    {it.a}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FAQ;
