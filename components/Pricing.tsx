"use client";

import { useTranslations } from "next-intl";
import { Check, Star } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { useUI } from "@/lib/ui-context";
import { loadStripe } from "@stripe/stripe-js";
import { buyCredits } from "@/app/actions";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

export default function Pricing() {
	const t = useTranslations("Pricing");
	const { user } = useAuth();
	const { openLoginModal } = useUI();
	const [loading, setLoading] = useState<string | null>(null);

	const handlePurchase = async (packageId: string) => {
		if (!user) {
			openLoginModal();
			return;
		}

		setLoading(packageId);
		try {
			const { sessionId } = await buyCredits(packageId);

			if (sessionId) {
				const stripe = await stripePromise;
				// @ts-ignore
				await stripe?.redirectToCheckout({ sessionId });
			}
		} catch (error) {
			console.error("Error creating checkout session", error);
			alert("Failed to initiate checkout. Please try again.");
		} finally {
			setLoading(null);
		}
	};

	const packages = [
		{
			id: "pixeliora_explorer",
			name: "Explorer",
			credits: 200,
			price: 5,
			priceStr: "€5",
			popular: false,
			translationKey: "starter",
			features: ["5_photos", "enhancements", "1_user"],
			gradient: "from-blue-500/20 to-cyan-500/20",
			border: "border-blue-500/30",
			buttonClass: "bg-white text-gray-900 border border-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)]",
			buttonHover: "hover:bg-gray-100",
		},
		{
			id: "pixeliora_creator",
			name: "Creator",
			credits: 800,
			price: 15,
			priceStr: "€15",
			popular: true,
			translationKey: "creator",
			features: ["25_photos", "all_styles", "enhancements", "2_3_users"],
			gradient: "from-cyan-500/20 to-fuchsia-500/20",
			border: "border-cyan-500/50",
			buttonClass: "bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white border-0 shadow-[0_0_20px_rgba(6,182,212,0.4)]",
			buttonHover: "hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02]",
		},
		{
			id: "pixeliora_studio",
			name: "Studio",
			credits: 1700,
			price: 25,
			priceStr: "€25",
			popular: false,
			translationKey: "studio",
			features: ["50_photos", "all_styles", "enhancements", "3_6_users"],
			gradient: "from-fuchsia-500/20 to-pink-500/20",
			border: "border-fuchsia-500/30",
			buttonClass: "bg-[#111128] text-white border border-white/20 hover:border-white/40",
			buttonHover: "hover:bg-white/5",
		},
	];

	return (
		<section id="pricing" className="py-24 bg-[#05050a] w-full border-t border-white/5 relative overflow-hidden">
			{/* Decorative Elements */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[300px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />

			<div className="max-w-6xl mx-auto px-6 relative z-10">
				<div className="text-center mb-16">
					<div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium text-sm">
						{t("coffeeValue")}
					</div>
					<h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
						{t("titlePrefix")}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
							{t("titleHighlight")}
						</span>
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
						{t("subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
					{packages.map((pkg) => (
						<div
							key={pkg.id}
							className={`relative rounded-3xl p-[2px] overflow-hidden transition-all duration-300 ${pkg.popular ? "scale-105 z-10 shadow-[0_0_50px_rgba(6,182,212,0.2)]" : "hover:scale-105 hover:z-10 shadow-xl"
								}`}
						>
							{pkg.popular && (
								<div className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-fuchsia-500 to-blue-500 animate-gradient-xy opacity-100 duration-1000"></div>
							)}
							{!pkg.popular && (
								<div className={`absolute inset-0 bg-gradient-to-b ${pkg.gradient} opacity-50`}></div>
							)}

							<div className="relative bg-[#0F0F1A] rounded-3xl h-full p-8 flex flex-col items-center text-center shadow-inner">
								{pkg.popular && (
									<div className="absolute top-0 right-8 transform -translate-y-1/2">
										<div className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg flex items-center gap-1">
											<Star className="w-3 h-3 fill-current" />
											{t("mostPopular")}
										</div>
									</div>
								)}

								<h3 className="text-xl font-bold text-gray-300 mb-2">
									{pkg.name}
								</h3>

								<div className="flex items-baseline justify-center gap-1 mb-2 mt-4">
									<span className="text-5xl font-black text-white">
										{pkg.priceStr}
									</span>
								</div>

								<div className="text-cyan-400 font-bold mb-8 text-lg">
									{t(`packages.${pkg.translationKey}.credits`)}
									{pkg.translationKey !== "starter" && (
										<div className="text-sm font-medium text-amber-400 mt-1">
											{t(`packages.${pkg.translationKey}.bonus`)}
										</div>
									)}
								</div>

								<ul className="flex-1 space-y-4 mb-8 w-full text-left">
									{pkg.features.map((feature, idx) => (
										<li
											key={idx}
											className="flex items-start text-gray-300 text-sm font-medium"
										>
											<Check className="w-5 h-5 text-cyan-500 mr-3 shrink-0" />
											{t(`features.${feature}`)}
										</li>
									))}
								</ul>

								<button
									onClick={() => handlePurchase(pkg.id)}
									disabled={loading === pkg.id}
									className={`w-full py-4 rounded-xl font-bold transition-all ${pkg.buttonClass} ${pkg.buttonHover}`}
								>
									{loading === pkg.id ? "..." : t("choose")}
								</button>
							</div>
						</div>
					))}
				</div>

				<div className="mt-16 max-w-3xl mx-auto rounded-3xl p-8 bg-[#151525] border border-white/5 text-center flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
					<div className="text-left">
						<h3 className="text-2xl font-bold text-white mb-2">
							{t("corporateTitle")}
						</h3>
						<p className="text-gray-400">
							{t("corporateDesc")}
						</p>
					</div>
					<a
						href="/contacts"
						className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold border border-white/10 transition-colors whitespace-nowrap"
					>
						{t("contactButton")}
					</a>
				</div>
			</div>
		</section>
	);
}
