"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Lock, Unlock, Download } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useGenerations } from "@/lib/generationContext";
import { getUserGenerations } from "@/app/actions";
import ResultView from "./ResultView";

export default function Gallery() {
	const t = useTranslations("Gallery");
	const { user } = useAuth();
	const { recentGenerations, addGeneration } = useGenerations();
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	useEffect(() => {
		if (user) {
			getUserGenerations().then((gens) => {
				gens.forEach((gen) => addGeneration(gen));
			});
		}
	}, [user, addGeneration]);

	if (!user || recentGenerations.length === 0) return null;

	return (
		<section className="w-full max-w-6xl mx-auto px-6 py-12">
			<div className="mb-8">
				<h3 className="text-2xl font-bold text-white flex items-center gap-3">
					{t("title")}
					<span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-gray-400">
						{recentGenerations.length}
					</span>
				</h3>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
				{recentGenerations.map((gen) => (
					<div
						key={gen.id}
						className="relative group aspect-square rounded-2xl overflow-hidden bg-[#111128] border border-white/5 cursor-pointer"
						onClick={() => setSelectedImage(gen.id)}
					>
						{gen.image ? (
							<img
								src={gen.image}
								alt="Generation"
								className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!gen.unlocked ? "blur-md scale-110" : ""
									}`}
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center bg-[#0a0a1a]">
								<div className="w-8 h-8 border-2 border-cyan-500/50 border-t-cyan-500 rounded-full animate-spin" />
							</div>
						)}

						<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
							<div className="bg-[#111128]/90 border border-white/10 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform">
								{gen.unlocked ? (
									<>
										<Download className="w-4 h-4 text-cyan-400" />
										{t("download")}
									</>
								) : (
									<>
										<Unlock className="w-4 h-4 text-cyan-400" />
										{t("editUnlock")}
									</>
								)}
							</div>
						</div>

						{/* Badge indicator */}
						<div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 backdrop-blur-md border border-white/10">
							{gen.unlocked ? (
								<Unlock className="w-3.5 h-3.5 text-cyan-400" />
							) : (
								<Lock className="w-3.5 h-3.5 text-amber-400" />
							)}
						</div>
					</div>
				))}
			</div>

			{selectedImage && (
				<ResultView
					generationId={selectedImage}
					onClose={() => setSelectedImage(null)}
				/>
			)}
		</section>
	);
}
