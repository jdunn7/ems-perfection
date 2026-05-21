import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import PromoBanner from "@/components/PromoBanner";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MAX_ATTEMPTS = 10;
const POLL_MS = 2000;

const BookingSuccess = () => {
    const { t } = useLanguage();
    const tb = t.booking;
    const [params] = useSearchParams();
    const sessionId = params.get("session_id");

    const [paid, setPaid] = useState(false);
    const [status, setStatus] = useState("polling"); // polling | paid | expired | error
    const attemptsRef = useRef(0);

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            return;
        }
        let cancelled = false;

        const poll = async () => {
            if (cancelled) return;
            try {
                const r = await axios.get(`${API}/booking/checkout/status/${sessionId}`);
                const data = r.data || {};
                if (data.payment_status === "paid") {
                    if (!cancelled) {
                        setStatus("paid");
                        setPaid(true);
                    }
                    return;
                }
                if (data.status === "expired") {
                    if (!cancelled) setStatus("expired");
                    return;
                }
                attemptsRef.current += 1;
                if (attemptsRef.current >= MAX_ATTEMPTS) {
                    if (!cancelled) setStatus("error");
                    return;
                }
                setTimeout(poll, POLL_MS);
            } catch (e) {
                attemptsRef.current += 1;
                if (attemptsRef.current >= MAX_ATTEMPTS) {
                    if (!cancelled) setStatus("error");
                    return;
                }
                setTimeout(poll, POLL_MS);
            }
        };
        poll();
        return () => {
            cancelled = true;
        };
    }, [sessionId]);

    return (
        <div className="min-h-screen w-full bg-background text-foreground flex flex-col">
            <PromoBanner />
            <Nav />
            <main className="flex-1 flex items-center justify-center px-6 py-24" data-testid="booking-success-page">
                <div className="max-w-xl w-full text-center bg-card rounded-[28px] p-10 md:p-14">
                    {paid ? (
                        <>
                            <div className="w-16 h-16 rounded-full bg-accent text-white mx-auto mb-6 flex items-center justify-center">
                                <CheckCircle2 size={28} />
                            </div>
                            <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                                {tb.kicker}
                            </span>
                            <h1 className="font-body text-3xl sm:text-4xl font-semibold mt-3 tracking-tight">
                                {tb.successTitle}
                                <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                                    ✨
                                </span>
                            </h1>
                            <p className="font-body text-muted-foreground mt-5">{tb.successCopy}</p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-foreground text-background font-body text-sm font-medium hover:bg-accent transition-colors"
                                data-testid="booking-success-home"
                            >
                                {tb.successCta}
                            </Link>
                        </>
                    ) : status === "expired" ? (
                        <>
                            <h1 className="font-body text-2xl sm:text-3xl font-semibold tracking-tight">
                                {tb.cancelTitle}
                            </h1>
                            <p className="font-body text-muted-foreground mt-4">{tb.cancelCopy}</p>
                            <Link
                                to="/#booking"
                                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-foreground text-background font-body text-sm font-medium hover:bg-accent transition-colors"
                            >
                                {tb.cancelCta}
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-accent/15 text-accent mx-auto mb-5 flex items-center justify-center">
                                <Loader2 className="animate-spin" size={22} />
                            </div>
                            <h1 className="font-body text-2xl font-semibold tracking-tight">
                                {tb.pendingTitle}
                            </h1>
                            <p className="font-body text-sm text-muted-foreground mt-3">
                                {tb.pendingCopy}
                            </p>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default BookingSuccess;
