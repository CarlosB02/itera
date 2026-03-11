"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function CookieBanner() {
    const t = useTranslations("CookieBanner");
    const [show, setShow] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("cookies-accepted");
        if (!accepted) {
            setShow(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookies-accepted", "true");
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <div className="max-w-4xl mx-auto bg-[#111128]/95 backdrop-blur-xl rounded-2xl border border-cyan-500/10 p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl">
                <p className="text-sm text-gray-400 text-center md:text-left">
                    {t("message")}
                </p>
                <div className="flex items-center gap-3 shrink-0">
                    <Link href="/privacy" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors whitespace-nowrap">
                        {t("learnMore")}
                    </Link>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-sm hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                    >
                        {t("accept")}
                    </button>
                </div>
            </div>
        </div>
    );
}
