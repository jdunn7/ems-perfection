import React, { useEffect, useState } from "react";
import axios from "axios";
import { Phone, ShieldCheck, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { artists } from "@/data/content";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BookingForm = () => {
    const { locale, t } = useLanguage();
    const tb = t.booking;
    const [services, setServices] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        service_key: "",
        artist_key: "",
        preferred_date: "",
        preferred_time: "",
        notes: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        axios
            .get(`${API}/services`)
            .then((r) => {
                if (!mounted) return;
                const list = r.data || [];
                setServices(list);
                if (list.length && !form.service_key) {
                    setForm((f) => (f.service_key ? f : { ...f, service_key: list[0].key }));
                }
            })
            .catch(() => {});
        return () => {
            mounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onSelectService = (e) => {
            const key = e.detail?.key;
            if (key) setForm((f) => ({ ...f, service_key: key }));
        };
        const onSelectArtist = (e) => {
            const key = e.detail?.artistKey;
            if (key) setForm((f) => ({ ...f, artist_key: key }));
        };
        window.addEventListener("browsems:select-service", onSelectService);
        window.addEventListener("browsems:select-artist", onSelectArtist);
        return () => {
            window.removeEventListener("browsems:select-service", onSelectService);
            window.removeEventListener("browsems:select-artist", onSelectArtist);
        };
    }, []);

    const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const selectedService = services.find((s) => s.key === form.service_key);

    const submit = async (e) => {
        e.preventDefault();
        if (!form.service_key || !form.name || !form.email || !form.preferred_date) {
            toast.error(tb.err);
            return;
        }
        setLoading(true);
        try {
            const origin = window.location.origin;
            const res = await axios.post(`${API}/booking/checkout`, {
                name: form.name,
                email: form.email,
                phone: form.phone || null,
                service_key: form.service_key,
                artist_key: form.artist_key || null,
                preferred_date: form.preferred_date,
                preferred_time: form.preferred_time || null,
                notes: form.notes || null,
                locale,
                origin_url: origin,
            });
            const url = res.data?.url;
            if (!url) throw new Error("No checkout URL");
            toast.message(tb.redirecting);
            // Persist booking id for success page polling
            try {
                window.localStorage.setItem("browsems_last_booking_id", res.data.booking_id || "");
            } catch (_) {
                /* no-op */
            }
            window.location.href = url;
        } catch (err) {
            toast.error(tb.err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="booking" data-testid="booking-section" className="section-y bg-background">
            <div className="container-x">
                <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                    <span className="font-body text-xs tracking-[0.3em] uppercase text-accent">
                        {tb.kicker}
                    </span>
                    <h2 className="mt-2 font-body text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.05]">
                        {tb.title}
                        <span className="font-heading text-accent ml-3 -rotate-2 inline-block">
                            {tb.cursive}
                        </span>
                    </h2>
                    <p className="font-body text-muted-foreground mt-4 text-base">{tb.sub}</p>
                </div>

                <div
                    data-testid="booking-card"
                    className="bg-foreground text-background rounded-[28px] p-6 sm:p-10 lg:p-12 max-w-5xl mx-auto"
                >
                    <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                        <input
                            required
                            placeholder={tb.fields.name}
                            value={form.name}
                            onChange={onChange("name")}
                            className="input-soft text-foreground"
                            data-testid="booking-name-input"
                        />
                        <input
                            type="email"
                            required
                            placeholder={tb.fields.email}
                            value={form.email}
                            onChange={onChange("email")}
                            className="input-soft text-foreground"
                            data-testid="booking-email-input"
                        />
                        <div className="relative">
                            <Phone
                                size={14}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                            <input
                                placeholder={tb.fields.phone}
                                value={form.phone}
                                onChange={onChange("phone")}
                                className="input-soft text-foreground pl-10"
                                data-testid="booking-phone-input"
                            />
                        </div>
                        <select
                            value={form.service_key}
                            onChange={onChange("service_key")}
                            className="input-soft text-foreground"
                            data-testid="booking-service-input"
                            aria-label={tb.fields.service}
                            required
                        >
                            {services.map((s) => (
                                <option key={s.key} value={s.key}>
                                    {(s.name?.[locale] || s.name?.en) + "  ·  $" + s.price.toFixed(0)}
                                </option>
                            ))}
                        </select>
                        <select
                            value={form.artist_key}
                            onChange={onChange("artist_key")}
                            className="input-soft text-foreground"
                            data-testid="booking-artist-input"
                            aria-label={tb.fields.artist}
                        >
                            <option value="">{tb.fields.anyArtist}</option>
                            {artists.map((a) => (
                                <option key={a.key} value={a.key}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="date"
                            required
                            value={form.preferred_date}
                            onChange={onChange("preferred_date")}
                            className="input-soft text-foreground"
                            aria-label={tb.fields.date}
                            data-testid="booking-date-input"
                        />
                        <input
                            type="time"
                            value={form.preferred_time}
                            onChange={onChange("preferred_time")}
                            className="input-soft text-foreground"
                            aria-label={tb.fields.time}
                            data-testid="booking-time-input"
                        />
                        <textarea
                            placeholder={tb.fields.notes}
                            rows={3}
                            value={form.notes}
                            onChange={onChange("notes")}
                            className="textarea-soft text-foreground sm:col-span-2"
                            data-testid="booking-notes-input"
                        />

                        <div className="sm:col-span-2 mt-4 flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/10">
                            <div className="flex items-center gap-3 font-body text-sm">
                                <span className="w-9 h-9 rounded-full bg-accent text-white flex items-center justify-center">
                                    <ShieldCheck size={16} />
                                </span>
                                <div>
                                    <p className="text-background">
                                        {tb.depositLine}:{" "}
                                        <strong>
                                            ${selectedService ? selectedService.deposit.toFixed(0) : "—"}
                                        </strong>
                                    </p>
                                    <p className="text-background/55 text-xs">{tb.depositSuffix}</p>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !selectedService}
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent text-white font-body font-medium text-sm transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98]"
                                data-testid="booking-submit-btn"
                            >
                                <Calendar size={16} />
                                {loading ? "…" : tb.cta}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default BookingForm;
