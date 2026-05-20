import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";

const PromoBanner = () => {
    const { t } = useLanguage();
    return (
        <div
            data-testid="promo-banner"
            className="promo-pulse text-white text-center text-xs sm:text-sm font-body font-medium py-2 px-4 tracking-wide"
        >
            {t.promo}
        </div>
    );
};

export default PromoBanner;
