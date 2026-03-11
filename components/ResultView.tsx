"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Download, X, Loader2, Sparkles, Lock, Unlock } from "lucide-react";
import { useGenerations } from "@/lib/generationContext";
import { unlockImage } from "@/app/actions";
import { useAuth } from "./AuthProvider";

interface ResultViewProps {
	generationId: string;
	onClose: () => void;
}

export default function ResultView({ generationId, onClose }: ResultViewProps) {
	const t = useTranslations("ResultView");
	const { credits, setCredits } = useAuth();
	const { recentGenerations, updateGeneration } = useGenerations();
	const [isUnlocking, setIsUnlocking] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const gen = recentGenerations.find((g) => g.id === generationId);

	if (!gen) return null;

	const handleUnlock = async () => {
		if (credits < 30) {
			setError(t("insufficientCredits", { fallback: "Not enough credits." }));
			return;
		}

		setIsUnlocking(true);
		setError(null);

		try {
			const { originalImage } = await unlockImage(generationId);
			updateGeneration(generationId, { image: originalImage, unlocked: true });
			setCredits(credits - 30);
		} catch (err: any) {
			setError(err.message || "Failed to unlock image.");
		} finally {
			setIsUnlocking(false);
		}
	};

	const handleDownload = () => {
		if (!gen?.image) return;
		const link = document.createElement("a");
		link.href = gen.image;
		link.download = `pixeliora-generation-${Date.now()}.jpg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
			<div className="bg-[#0a0a1a] rounded-3xl w-full max-w-5xl h-[90vh] md:h-[80vh] flex flex-col md:flex-row relative border border-white/10 shadow-2xl overflow-hidden">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full backdrop-blur-md transition-all"
				>
					<X className="w-5 h-5" />
				</button>

				{/* Image DisplayArea */}
				<div className="flex-1 bg-black relative flex items-center justify-center w-full h-1/2 md:h-full overflow-hidden p-4 md:p-8">
					{gen.image && (
						<img
							src={gen.image}
							alt="Generation Result"
							className={`max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-700 ${!gen.unlocked ? "blur-xl scale-105" : ""
								}`}
						/>
					)}

					{!gen.unlocked && (
						<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center z-10 pointer-events-none">
							<div className="bg-[#111128]/80 backdrop-blur-md border border-cyan-500/20 px-6 py-4 rounded-2xl flex flex-col items-center disabled-pointer-events pointer-events-auto">
								<Lock className="w-8 h-8 text-amber-400 mb-3" />
								<p className="text-white font-medium text-center">
									{t("previewMode", { fallback: "Preview Mode" })}
								</p>
								<p className="text-xs text-gray-400 mt-1">
									{t("unlockDesc")}
								</p>
							</div>
						</div>
					)}
				</div>

				{/* Panel Sidebar */}
				<div className="w-full md:w-80 h-1/2 md:h-full bg-[#111128] border-t md:border-t-0 md:border-l border-white/5 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
					<div>
						<h3 className="text-2xl font-bold text-white mb-6">
							{t("details", { fallback: "Generation Details" })}
						</h3>

						<div className="space-y-4">
							<div className="p-4 bg-black/20 rounded-xl border border-white/5">
								<div className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">
									{t("status", { fallback: "Status" })}
								</div>
								<div className="flex items-center gap-2 text-white font-medium">
									{gen.unlocked ? (
										<><Unlock className="w-4 h-4 text-cyan-400" /> {t("unlocked", { fallback: "Full HD Unlocked" })}</>
									) : (
										<><Lock className="w-4 h-4 text-amber-400" /> {t("previewOnly", { fallback: "Low-Res Preview" })}</>
									)}
								</div>
							</div>
						</div>

						{error && (
							<div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
								{error}
							</div>
						)}
					</div>

					<div className="mt-8 flex flex-col gap-3">
						{gen.unlocked ? (
							<button
								onClick={handleDownload}
								className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-cyan-500/20"
							>
								<Download className="w-5 h-5" />
								{t("download")}
							</button>
						) : (
							<button
								onClick={handleUnlock}
								disabled={isUnlocking}
								className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 group"
							>
								{isUnlocking ? (
									<>
										<Loader2 className="w-5 h-5 animate-spin" />
										{t("unlocking", { fallback: "Unlocking..." })}
									</>
								) : (
									<>
										<Sparkles className="w-5 h-5 text-white/80 group-hover:animate-pulse" />
										{t("unlock")} (30 {t("credits", { fallback: "credits" })})
									</>
								)}
							</button>
						)}

						<button
							onClick={onClose}
							className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
						>
							{t("closeDialog", { fallback: "Close" })}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
