import React, { useState } from "react";
import axios from "axios";
import { Mail, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const NewsletterCard = () => {
    const { locale, t } = useLanguage();
    const tn = t.newsletter;
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!email) return;
        setLoading(true);
        try {
            await axios.post(`${API}/newsletter`, { email, locale });
            toast.success(tn.ok);
            setEmail("");
        } catch (err) {
            toast.error(tn.err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-3xl p-8 md:p-10 flex flex-col" data-testid="newsletter-card">
            <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Mail size={18} />
                </span>
                <h3 className="font-body text-xl md:text-2xl font-semibold">{tn.title}</h3>
            </div>
            <p className="font-body text-muted-foreground text-sm mb-6">{tn.copy}</p>
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
                <input
                    type="email"
                    required
                    placeholder={tn.placeholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-soft flex-1"
                    data-testid="newsletter-email-input"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-pill whitespace-nowrap disabled:opacity-60"
                    data-testid="newsletter-submit-btn"
                >
                    {loading ? "…" : tn.cta}
                </button>
            </form>
        </div>
    );
};

const ContactCard = () => {
    const { locale, t } = useLanguage();
    const tc = t.contact;
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API}/contact`, { ...form, locale });
            toast.success(tc.ok);
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error(tc.err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card rounded-3xl p-8 md:p-10 flex flex-col" data-testid="contact-card">
            <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                    <Send size={18} />
                </span>
                <h3 className="font-body text-xl md:text-2xl font-semibold">{tc.title}</h3>
            </div>
            <p className="font-body text-muted-foreground text-sm mb-6">{tc.copy}</p>
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                    required
                    placeholder={tc.name}
                    value={form.name}
                    onChange={onChange("name")}
                    className="input-soft"
                    data-testid="contact-name-input"
                />
                <input
                    type="email"
                    required
                    placeholder={tc.email}
                    value={form.email}
                    onChange={onChange("email")}
                    className="input-soft"
                    data-testid="contact-email-input"
                />
                <input
                    placeholder={tc.subject}
                    value={form.subject}
                    onChange={onChange("subject")}
                    className="input-soft sm:col-span-2"
                    data-testid="contact-subject-input"
                />
                <textarea
                    required
                    placeholder={tc.message}
                    rows={4}
                    value={form.message}
                    onChange={onChange("message")}
                    className="textarea-soft sm:col-span-2"
                    data-testid="contact-message-input"
                />
                <div className="sm:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-pill disabled:opacity-60"
                        data-testid="contact-submit-btn"
                    >
                        {loading ? "…" : tc.cta}
                    </button>
                </div>
            </form>
        </div>
    );
};

const NewsletterAndContact = () => {
    return (
        <section id="contact" data-testid="contact-section" className="section-y bg-background">
            <div className="container-x">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <NewsletterCard />
                    <ContactCard />
                </div>
            </div>
        </section>
    );
};

export default NewsletterAndContact;
