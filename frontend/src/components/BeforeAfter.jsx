import React, { useRef, useState, useCallback } from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { beforeAfter } from "@/data/content";

const Reveal = ({ before, after, beforeLabel, afterLabel, testId }) => {
    const [pos, setPos] = useState(50); // 0..100
    const ref = useRef(null);

    const update = useCallback((clientX) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = clientX - rect.left;
        const next = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setPos(next);
    }, []);

    const onMove = (e) => update(e.clientX);
    const onTouch = (e) => {
        if (e.touches && e.touches[0]) update(e.touches[0].clientX);
    };

    return (
        <div
            ref={ref}
            data-testid={testId}
            className="relative aspect-[4/5] rounded-3xl overflow-hidden select-none cursor-ew-resize group bg-card"
            onMouseMove={onMove}
            onTouchMove={onTouch}
        >
            <img
                src={after}
                alt="After"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />
            <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${pos}%` }}
            >
                <img
                    src={before}
                    alt="Before"
                    loading="lazy"
                    className="absolute inset-y-0 left-0 h-full object-cover"
                    style={{ width: ref.current ? `${ref.current.getBoundingClientRect().width}px` : "100%" }}
                    draggable={false}
                />
            </div>
            {/* labels */}
            <span className="absolute top-4 left-4 bg-black/55 text-white text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full font-body">
                {beforeLabel}
            </span>
            <span className="absolute top-4 right-4 bg-white/90 text-foreground text-[10px] tracking-[0.25em] uppercase px-2.5 py-1 rounded-full font-body">
                {afterLabel}
            </span>
            {/* handle */}
            <div
                className="absolute inset-y-0 w-px bg-white/90 pointer-events-none shadow-[0_0_24px_rgba(255,255,255,0.6)]"
                style={{ left: `${pos}%` }}
            />
            <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center pointer-events-none shadow-lg font-body text-xs font-semibold"
                style={{ left: `${pos}%` }}
            >
                ⇆
            </div>
        </div>
    );
};

const BeforeAfter = () => {
    const { locale, t } = useLanguage();
    return (
        <section
            id="gallery"
            data-testid="gallery-section"
            className="section-y bg-background"
        >
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
                    <div className="max-w-2xl">
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.gallery.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.gallery.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {t.gallery.cursive}
                            </span>
                        </h2>
                        <p className="font-body text-muted-foreground mt-4 text-base">{t.gallery.sub}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {beforeAfter.map((p) => (
                        <div key={p.id} className="flex flex-col">
                            <Reveal
                                before={p.before}
                                after={p.after}
                                beforeLabel={t.gallery.before}
                                afterLabel={t.gallery.after}
                                testId={`ba-reveal-${p.id}`}
                            />
                            <div className="flex items-center justify-between mt-4 px-1">
                                <span className="font-body text-sm text-foreground font-semibold">
                                    {p.service[locale]}
                                </span>
                                <span className="font-heading text-accent text-xl -rotate-1">
                                    by {p.artist}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="text-center text-xs text-muted-foreground mt-10 font-body">
                    {locale === "es"
                        ? "Desliza sobre cada imagen para ver el antes y después."
                        : "Drag across each image to compare before & after."}
                </p>
            </div>
        </section>
    );
};

export default BeforeAfter;
