import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations("Privacy");

    return (
        <div className="min-h-screen bg-[#06060e] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    {t("title", { fallback: "Privacy Policy" })}
                </h1>
                <div className="prose prose-invert prose-cyan max-w-none text-gray-300">
                    <p>{t("content", { fallback: "Your privacy is important to us. This policy outlines how we collect, use, and protect your personal information when you use Pixeliora." })}</p>
                    
                    <h3>1. Data Collection</h3>
                    <p>We only collect the prompts and styling choices you provide to generate images. Authenticated information via Google is used to maintain your credits ledger securely.</p>
                    
                    <h3>2. Image Processing</h3>
                    <p>Generated images are stored in a secure cloud bucket (Supabase Storage). We do not claim ownership of the images you create.</p>
                </div>
            </div>
        </div>
    );
}
