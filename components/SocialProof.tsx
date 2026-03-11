"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export default function SocialProof() {
	const t = useTranslations("SocialProof");

	const testimonials = [
		{
			name: t("testimonials.0.name"),
			role: t("testimonials.0.role"),
			text: t("testimonials.0.text"),
			avatarBg: "from-cyan-400 to-blue-500",
		},
		{
			name: t("testimonials.1.name"),
			role: t("testimonials.1.role"),
			text: t("testimonials.1.text"),
			avatarBg: "from-fuchsia-400 to-pink-500",
		},
		{
			name: t("testimonials.2.name"),
			role: t("testimonials.2.role"),
			text: t("testimonials.2.text"),
			avatarBg: "from-amber-400 to-orange-500",
		},
	];

	return (
		<section className="py-24 bg-[#0a0a1a] w-full border-t border-white/5 relative z-10">
			<div className="max-w-6xl mx-auto px-6">
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
						{t("title")}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
							{t("titleHighlight")}
						</span>
					</h2>
					<p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
						{t("subtitle")}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((test, idx) => (
						<div
							key={idx}
							className="bg-[#111128] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors"
						>
							<div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] group-hover:bg-cyan-500/20 transition-colors" />

							<div className="flex gap-1 mb-6">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-5 h-5 fill-amber-500 text-amber-500 line-clamp-4"
									/>
								))}
							</div>

							<p className="text-gray-300 mb-8 italic text-lg leading-relaxed relative z-10">
								"{test.text}"
							</p>

							<div className="flex items-center gap-4 relative z-10">
								<div
									className={`w-12 h-12 rounded-full bg-gradient-to-br ${test.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-inner`}
								>
									{test.name.charAt(0)}
								</div>
								<div>
									<div className="text-white font-bold">{test.name}</div>
									<div className="text-cyan-400 text-sm font-medium">
										{test.role}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
