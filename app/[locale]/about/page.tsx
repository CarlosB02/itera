import { useTranslations } from "next-intl";

export default function AboutPage() {
    const t = useTranslations("About");

    return (
        <div className="min-h-screen bg-[#06060e] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    {t("title", { fallback: "About Pixeliora" })}
                </h1>
                <div className="prose prose-invert prose-cyan max-w-none prose-lg">
                    <p className="text-gray-300 leading-relaxed">
                        {t("description", { fallback: "Pixeliora uses cutting-edge artificial intelligence to transform your textual prompts into vibrant, stunning visual masterpieces. Our mission is to democratize digital art creation." })}
                    </p>
                    <h2 className="text-2xl font-semibold text-cyan-400 mt-12 mb-4">Our Vision</h2>
                    <p className="text-gray-300 leading-relaxed">
                        We believe that imagination shouldn't be bottlenecked by technical skill. The cosmic design of Pixeliora is inspired by the vastness of the universe—representing the infinite possibilities of your creativity when paired with our AI engine.
                    </p>
                </div>
            </div>
        </div>
    );
}
