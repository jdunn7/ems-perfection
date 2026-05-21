import React, { useEffect, useState } from "react";
import axios from "axios";
import { Sparkles, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Services = () => {
    const { locale, t } = useLanguage();
    const [services, setServices] = useState([]);

    useEffect(() => {
        let mounted = true;
        axios
            .get(`${API}/services`)
            .then((r) => mounted && setServices(r.data || []))
            .catch(() => mounted && setServices([]));
        return () => {
            mounted = false;
        };
    }, []);

    const onBook = (key) => {
        const el = document.getElementById("booking");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        // pre-select service via custom event
        window.dispatchEvent(new CustomEvent("browsems:select-service", { detail: { key } }));
    };

    return (
        <section id="services" data-testid="services-section" className="section-y bg-background">
            <div className="container-x">
                <div className="flex items-end justify-between gap-4 mb-10 md:mb-14">
                    <div className="max-w-2xl">
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {t.services.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {t.services.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {t.services.cursive}
                            </span>
                        </h2>
                        <p className="font-body text-muted-foreground mt-4 text-base">{t.services.sub}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                    {services.map((s, i) => (
                        <article
                            key={s.key}
                            data-testid={`service-card-${s.key}`}
                            className={`relative rounded-3xl p-7 lg:p-8 flex flex-col group transition-all duration-500 ${
                                i === 0
                                    ? "bg-foreground text-background"
                                    : "bg-card text-foreground hover:bg-card/70"
                            }`}
                        >
                            {i === 0 && (
                                <span className="absolute top-5 right-5 flex items-center gap-1.5 bg-accent text-white text-[10px] font-semibold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full">
                                    <Sparkles size={11} /> Signature
                                </span>
                            )}
                            <h3 className="font-body text-xl lg:text-2xl font-semibold leading-tight">
                                {s.name?.[locale] || s.name?.en}
                            </h3>
                            <p
                                className={`font-body text-sm mt-3 ${
                                    i === 0 ? "text-background/75" : "text-muted-foreground"
                                }`}
                            >
                                {s.blurb?.[locale] || s.blurb?.en}
                            </p>

                            <div
                                className={`mt-5 flex items-center gap-4 text-xs font-body ${
                                    i === 0 ? "text-background/70" : "text-muted-foreground"
                                }`}
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock size={12} /> {s.duration_min} min
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    {t.services.depositLabel}: <strong className={i === 0 ? "text-background" : "text-foreground"}>${s.deposit?.toFixed(0)}</strong>
                                </span>
                            </div>

                            <div className="mt-6 pt-6 border-t border-current/15 flex items-end justify-between gap-3">
                                <div>
                                    <span
                                        className={`block font-body text-[10px] uppercase tracking-[0.25em] mb-1 ${
                                            i === 0 ? "text-background/60" : "text-muted-foreground"
                                        }`}
                                    >
                                        {t.services.from}
                                    </span>
                                    <span className="font-body text-2xl lg:text-3xl font-semibold tracking-tight">
                                        ${s.price?.toFixed(0)}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => onBook(s.key)}
                                    data-testid={`service-book-${s.key}`}
                                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all duration-300 active:scale-[0.98] ${
                                        i === 0
                                            ? "bg-background text-foreground hover:bg-accent hover:text-white"
                                            : "bg-foreground text-background hover:bg-accent"
                                    }`}
                                >
                                    {t.services.bookBtn}
                                    <span className="inline-block w-4 h-px bg-current opacity-60" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
