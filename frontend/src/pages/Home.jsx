import React from "react";
import PromoBanner from "@/components/PromoBanner";
import Nav from "@/components/Nav";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import Services from "@/components/Services";
import TaglineRibbon from "@/components/TaglineRibbon";
import Process from "@/components/Process";
import Artists from "@/components/Artists";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import BookingForm from "@/components/BookingForm";
import Location from "@/components/Location";
import NewsletterAndContact from "@/components/Forms";
import Footer from "@/components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <PromoBanner />
            <Nav />
            <main>
                <ScrollVideoHero />
                <Services />
                <TaglineRibbon />
                <Process />
                <Artists />
                <BeforeAfter />
                <Testimonials />
                <FAQ />
                <BookingForm />
                <Location />
                <NewsletterAndContact />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
