import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

const Location = () => {
    const { t } = useLanguage();
    const l = t.location;
    return (
        <section id="visit" data-testid="location-section" className="section-y bg-card/40">
            <div className="container-x">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                    <div>
                        <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                            {l.kicker}
                        </span>
                        <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                            {l.title}
                            <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                {l.cursive}
                            </span>
                        </h2>

                        <div className="mt-8 space-y-5">
                            <div className="flex items-start gap-4">
                                <span className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-none">
                                    <MapPin size={16} />
                                </span>
                                <div>
                                    <p className="font-body text-base text-foreground font-semibold">{l.address}</p>
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(l.address)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-sm font-body text-accent border-b border-accent/50 hover:border-accent transition-colors"
                                        data-testid="location-directions"
                                    >
                                        {l.directions}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-none">
                                    <Clock size={16} />
                                </span>
                                <div>
                                    <p className="font-body text-sm uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                        {l.hoursTitle}
                                    </p>
                                    <ul className="font-body text-base text-foreground space-y-1">
                                        {l.hours.map((h) => (
                                            <li key={h.d} className="flex justify-between gap-6 max-w-xs">
                                                <span className="text-muted-foreground">{h.d}</span>
                                                <span>{h.t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-none">
                                    <Phone size={16} />
                                </span>
                                <a
                                    href={`tel:${l.phone.replace(/\D/g, "")}`}
                                    className="font-body text-base text-foreground hover:text-accent transition-colors"
                                    data-testid="location-phone"
                                >
                                    {l.phone}
                                </a>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="w-10 h-10 rounded-full bg-accent/15 text-accent flex items-center justify-center flex-none">
                                    <Mail size={16} />
                                </span>
                                <a
                                    href={`mailto:${l.email}`}
                                    className="font-body text-base text-foreground hover:text-accent transition-colors"
                                    data-testid="location-email"
                                >
                                    {l.email}
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden min-h-[400px] bg-card">
                        <iframe
                            title="BrowsEMS Studio Map"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(l.address)}&output=embed`}
                            width="100%"
                            height="100%"
                            loading="lazy"
                            allowFullScreen=""
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0 w-full h-full"
                            data-testid="location-map"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Location;
