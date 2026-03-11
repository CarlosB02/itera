import { useTranslations } from "next-intl";

export default function TermsPage() {
    const t = useTranslations("Terms");

    return (
        <div className="min-h-screen bg-[#06060e] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    {t("title", { fallback: "Terms of Service" })}
                </h1>
                <div className="prose prose-invert prose-cyan max-w-none text-gray-300">
                    <p>{t("content", { fallback: "By using Pixeliora, you agree to the following terms and conditions governing the use of our AI image generation service." })}</p>
                    
                    <h3>1. Credits and Refunds</h3>
                    <p>Credits purchased are non-refundable. They represent usage time and compute costs on our AI clusters. If an image generation fails outright, credits are not deducted.</p>
                    
                    <h3>2. Acceptable Use</h3>
                    <p>You agree not to use the service to generate illegal, hateful, explicit, or copyright-infringing material.</p>
                </div>
            </div>
        </div>
    );
}
