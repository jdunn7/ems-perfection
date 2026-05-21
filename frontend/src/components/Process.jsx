import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const Process = () => {
    const { t } = useLanguage();
    return (
        <section
            id="process"
            data-testid="process-section"
            className="section-y bg-background"
        >
            <div className="container-x">
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                        {t.process.kicker}
                    </span>
                    <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                        {t.process.title}
                        <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                            {t.process.cursive}
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
                    {t.process.steps.map((step, i) => (
                        <article
                            key={step.tag}
                            data-testid={`process-step-${i}`}
                            className="relative bg-card rounded-3xl p-7 lg:p-9 overflow-hidden"
                        >
                            <span className="font-heading text-accent text-7xl lg:text-8xl leading-none absolute -top-2 right-4 opacity-40">
                                {step.tag}
                            </span>
                            <h3 className="relative font-body text-xl lg:text-2xl font-semibold tracking-tight text-foreground">
                                {step.title}
                            </h3>
                            <p className="relative font-body text-sm text-muted-foreground mt-3 max-w-xs">
                                {step.copy}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;
