import React from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import PromoBanner from "@/components/PromoBanner";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BookingCancel = () => {
    const { t } = useLanguage();
    const tb = t.booking;
    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
            <PromoBanner />
            <Nav />
            <main className="flex-1 flex items-center justify-center px-6 py-24" data-testid="booking-cancel-page">
                <div className="max-w-xl w-full text-center bg-card rounded-[28px] p-10 md:p-14">
                    <div className="w-16 h-16 rounded-full bg-muted text-foreground/70 mx-auto mb-6 flex items-center justify-center">
                        <XCircle size={28} />
                    </div>
                    <h1 className="font-body text-3xl sm:text-4xl font-semibold tracking-tight">
                        {tb.cancelTitle}
                    </h1>
                    <p className="font-body text-muted-foreground mt-5">{tb.cancelCopy}</p>
                    <Link
                        to="/#booking"
                        className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-foreground text-background font-body text-sm font-medium hover:bg-accent transition-colors"
                        data-testid="booking-cancel-cta"
                    >
                        {tb.cancelCta}
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingCancel;
