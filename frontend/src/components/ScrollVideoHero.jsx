import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { HERO_VIDEO_URL, HERO_POSTER_URL } from "@/data/content";

// Detect mobile / reduced-motion at module load so SSR-safety is fine (component is client-only in CRA).
const detectEnv = () => {
    if (typeof window === "undefined") {
        return { reducedMotion: false, isMobile: false, isiOS: false };
    }
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const ua = window.navigator.userAgent || "";
    const isiOS = /iPhone|iPad|iPod/i.test(ua);
    const isMobile = window.innerWidth < 768 || isiOS;
    return { reducedMotion, isMobile, isiOS };
};

const ScrollVideoHero = () => {
    const { t } = useLanguage();
    const containerRef = useRef(null);
    const videoRef = useRef(null);

    const [progress, setProgress] = useState(0); // 0..1
    const [env] = useState(detectEnv);
    const [videoReady, setVideoReady] = useState(false);
    const [duration, setDuration] = useState(0);

    const useScrub = !env.reducedMotion && !env.isMobile;

    // rAF-driven scrub loop. Uses target/current lerp for smoothness.
    useEffect(() => {
        if (!useScrub) return;
        const video = videoRef.current;
        const container = containerRef.current;
        if (!video || !container) return;

        let rafId = 0;
        let target = 0;
        let current = 0;

        const computeProgress = () => {
            const rect = container.getBoundingClientRect();
            const total = container.offsetHeight - window.innerHeight;
            if (total <= 0) return 0;
            const scrolled = Math.min(Math.max(-rect.top, 0), total);
            return scrolled / total;
        };

        const onScroll = () => {
            target = computeProgress();
        };

        const tick = () => {
            // ease toward target
            current += (target - current) * 0.16;
            if (Math.abs(target - current) < 0.0005) current = target;

            setProgress(current);

            if (video.readyState >= 1 && video.duration && isFinite(video.duration)) {
                const t = current * video.duration;
                // Avoid micro-thrashing
                if (Math.abs(video.currentTime - t) > 0.04) {
                    try {
                        video.currentTime = t;
                    } catch (_) {
                        /* no-op */
                    }
                }
            }
            rafId = requestAnimationFrame(tick);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        rafId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [useScrub, videoReady]);

    // Track progress on mobile too (for synced text), but DON'T touch video.currentTime there
    useEffect(() => {
        if (useScrub) return;
        const container = containerRef.current;
        if (!container) return;

        const onScroll = () => {
            const rect = container.getBoundingClientRect();
            const total = container.offsetHeight - window.innerHeight;
            if (total <= 0) {
                setProgress(0);
                return;
            }
            const scrolled = Math.min(Math.max(-rect.top, 0), total);
            setProgress(scrolled / total);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [useScrub]);

    const handleLoaded = () => {
        const v = videoRef.current;
        if (v) {
            setDuration(v.duration || 0);
            v.pause();
            try {
                v.currentTime = 0.001;
            } catch (_) {
                /* no-op */
            }
            setVideoReady(true);
        }
    };

    // Determine which text state is active (0,1,2) based on progress windows
    const states = t.hero.states;
    const getActive = (p) => {
        // simple banding: 0-0.33 -> 0, 0.33-0.66 -> 1, 0.66-1 -> 2
        if (p < 0.33) return 0;
        if (p < 0.66) return 1;
        return 2;
    };
    const active = getActive(progress);

    // For each state compute opacity for cross-fade feel
    const stateOpacity = (i) => {
        // peak window center: 0.165, 0.495, 0.825
        const centers = [0.16, 0.5, 0.84];
        const width = 0.22;
        const d = Math.abs(progress - centers[i]);
        // ramp: full 1 within ~0.10 of center, fades to 0 at center+width
        const v = 1 - Math.max(0, (d - 0.08) / (width - 0.08));
        return Math.max(0, Math.min(1, v));
    };

    return (
        <section
            id="top"
            ref={containerRef}
            data-testid="hero-section"
            // The driver container: 300vh tall on desktop with scrubbing,
            // 100vh on mobile / reduced-motion fallback (no scroll driver needed)
            className={useScrub ? "relative w-full" : "relative w-full"}
            style={{ height: useScrub ? "300vh" : "100vh" }}
        >
            {/* Sticky video stage */}
            <div className="sticky top-0 h-screen w-full overflow-hidden bg-foreground">
                {/* Video / fallback poster */}
                {env.reducedMotion ? (
                    <img
                        src={HERO_POSTER_URL}
                        alt="BrowsEMS hero"
                        className="absolute inset-0 w-full h-full object-cover"
                        data-testid="hero-poster-fallback"
                    />
                ) : (
                    <video
                        ref={videoRef}
                        data-testid="hero-video"
                        src={HERO_VIDEO_URL}
                        poster={HERO_POSTER_URL}
                        muted
                        playsInline
                        preload="auto"
                        loop={!useScrub}
                        autoPlay={!useScrub}
                        onLoadedMetadata={handleLoaded}
                        onCanPlay={handleLoaded}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Soft gradient + vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/55 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.45)_100%)] pointer-events-none" />

                {/* Brand kicker top-left of hero (inside the stage, beneath nav) */}
                <div className="absolute top-6 left-0 right-0 pointer-events-none">
                    <div className="container-x">
                        <span
                            data-testid="hero-kicker"
                            className="font-body text-xs tracking-[0.3em] uppercase text-white/80"
                        >
                            {t.hero.kicker}
                        </span>
                    </div>
                </div>

                {/* Text states */}
                <div className="absolute inset-0 flex items-center pointer-events-none">
                    <div className="container-x w-full">
                        <div className="max-w-2xl relative min-h-[260px] sm:min-h-[300px]">
                            {states.map((s, i) => (
                                <div
                                    key={i}
                                    data-testid={`hero-text-state-${i}`}
                                    className="absolute inset-0 flex flex-col justify-center transition-opacity duration-500"
                                    style={{ opacity: stateOpacity(i) }}
                                >
                                    <span className="font-heading text-3xl sm:text-4xl text-white/90 leading-none mb-3">
                                        {s.eyebrow}
                                    </span>
                                    <h1 className="font-body text-white text-4xl sm:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.02] mb-4 drop-shadow-[0_2px_24px_rgba(0,0,0,0.35)]">
                                        {s.title}
                                    </h1>
                                    <p className="font-body text-white/85 text-base sm:text-lg max-w-xl">
                                        {s.caption}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* CTA + scroll hint, anchored bottom */}
                        <div className="absolute left-0 right-0 bottom-10 container-x flex flex-wrap items-end justify-between gap-6 pointer-events-auto">
                            <a
                                href="#best-sellers"
                                data-testid="hero-cta"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-foreground font-body font-medium text-sm transition-all duration-300 hover:bg-accent hover:text-white active:scale-[0.98]"
                            >
                                {t.hero.cta}
                                <span className="inline-block w-5 h-px bg-current opacity-60" />
                                <ArrowDown size={16} />
                            </a>

                            {useScrub && (
                                <div className="hidden sm:flex items-center gap-3 text-white/70 text-xs font-body uppercase tracking-[0.25em]">
                                    <span>{t.hero.scrollHint}</span>
                                    <div className="relative w-24 h-px bg-white/30 overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white/90"
                                            style={{ width: `${Math.round(progress * 100)}%`, transition: "width 80ms linear" }}
                                        />
                                    </div>
                                    <span data-testid="hero-progress" className="tabular-nums">
                                        {String(Math.round(progress * 100)).padStart(2, "0")}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Decorative cursive wordmark — subtle, bottom-right */}
                <div className="absolute bottom-6 right-6 hidden md:block pointer-events-none select-none">
                    <span className="font-heading text-white/30 text-3xl">
                        crowned glam
                    </span>
                </div>
            </div>
        </section>
    );
};

export default ScrollVideoHero;
