import { useTranslations } from "next-intl";

export default function ContactsPage() {
    const t = useTranslations("Contacts");

    return (
        <div className="min-h-screen bg-[#06060e] pt-32 pb-24">
            <div className="max-w-3xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                    {t("title", { fallback: "Contact Us" })}
                </h1>
                <div className="bg-[#111128] border border-cyan-500/20 rounded-3xl p-8 md:p-12">
                    <p className="text-lg text-gray-300 mb-8">
                        {t("description", { fallback: "Have questions about Pixeliora? Want to discuss enterprise pricing? We'd love to hear from you." })}
                    </p>
                    <div className="flex items-center gap-4 text-xl">
                        <span className="text-gray-400">{t("email", { fallback: "Email us at" })}:</span>
                        <a href="mailto:hello@pixeliora.com" className="text-cyan-400 font-bold hover:text-cyan-300 transition-colors">
                            hello@pixeliora.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
