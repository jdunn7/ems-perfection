import React from "react";
import PromoBanner from "@/components/PromoBanner";
import Nav from "@/components/Nav";
import ScrollVideoHero from "@/components/ScrollVideoHero";
import BestSellers from "@/components/BestSellers";
import TaglineRibbon from "@/components/TaglineRibbon";
import ShopByCategory from "@/components/ShopByCategory";
import FeaturedBanners from "@/components/FeaturedBanners";
import Stories from "@/components/Stories";
import InstagramFeed from "@/components/InstagramFeed";
import Forms from "@/components/Forms";
import Footer from "@/components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <PromoBanner />
            <Nav />
            <main>
                <ScrollVideoHero />
                <BestSellers />
                <TaglineRibbon />
                <ShopByCategory />
                <FeaturedBanners />
                <Stories />
                <InstagramFeed />
                <Forms />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
