"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

export default function ShowcaseSection() {
    const t = useTranslations("Showcase");

    const showcaseItems = [
        {
            style: "Photorealistic",
            prompt: "A neon-lit cyberpunk street in Tokyo during heavy rain.",
            img: "https://replicate.delivery/pbxt/Example1PlaceholderImageUrlHere/output.jpg"
        },
        {
            style: "Fantasy Art",
            prompt: "A glowing magical tree in the center of an ancient elven ruins.",
            img: "https://replicate.delivery/pbxt/Example2PlaceholderImageUrlHere/output.jpg"
        },
        {
            style: "Anime",
            prompt: "A young hero standing on a cliff looking at a floating island, studio ghibli style.",
            img: "https://replicate.delivery/pbxt/Example3PlaceholderImageUrlHere/output.jpg"
        }
    ];

    return (
        <section className="py-24 relative z-10 bg-[#06060e] border-t border-white/5">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        {t("titlePrefix", { fallback: "Explore the" })}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                            {t("titleHighlight", { fallback: "Possibilities" })}
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {t("subtitle", { fallback: "See what others are generating with Pixeliora's advanced AI engine." })}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {showcaseItems.map((item, idx) => (
                        <div key={idx} className="group rounded-3xl overflow-hidden bg-[#111128] border border-white/5 relative">
                            {/* In a real scenario, use actual generated images. For layout purposes, creating a placeholder gradient box */}
                            <div className={`aspect-[4/5] w-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center group-hover:opacity-80 transition-opacity`}>
                                {/* Replace with <img src={item.img} /> in production */}
                                <div className="text-gray-600 font-medium opacity-50 text-xl tracking-widest">{item.style}</div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-semibold mb-3 w-max">
                                    {item.style}
                                </div>
                                <p className="text-white text-sm leading-relaxed font-medium line-clamp-3">
                                    "{item.prompt}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
