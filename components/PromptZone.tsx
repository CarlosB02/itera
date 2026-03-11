"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, Image as ImageIcon, Wand2, Loader2, Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useUI } from "@/lib/ui-context";
import { generateImage, checkGenerationStatus, finalizeGeneration } from "@/app/actions";
import { useGenerations } from "@/lib/generationContext";

export default function PromptZone() {
	const t = useTranslations("PromptZone");
	const { user, credits } = useAuth();
	const { openLoginModal } = useUI();
	const { addGeneration } = useGenerations();

	const [prompt, setPrompt] = useState("");
	const [style, setStyle] = useState("photorealistic");
	const [isGenerating, setIsGenerating] = useState(false);
	const [loadingStep, setLoadingStep] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const styles = [
		{ id: "photorealistic", label: t("styles.photorealistic"), desc: t("styles.photorealisticDesc") },
		{ id: "anime", label: t("styles.anime"), desc: t("styles.animeDesc") },
		{ id: "fantasy", label: t("styles.fantasy"), desc: t("styles.fantasyDesc") },
		{ id: "concept", label: t("styles.concept"), desc: t("styles.conceptDesc") },
	];

	const loadingMessages = [
		t("loadingMessages.0"),
		t("loadingMessages.1"),
		t("loadingMessages.2"),
		t("loadingMessages.3"),
		t("loadingMessages.4"),
	];

	const handleGenerate = async () => {
		if (!user) {
			openLoginModal();
			return;
		}

		if (credits < 30) {
			const pricingElement = document.getElementById("pricing");
			if (pricingElement) pricingElement.scrollIntoView({ behavior: "smooth" });
			return;
		}

		if (!prompt.trim()) {
			setError(t("emptyPrompt"));
			return;
		}

		setIsGenerating(true);
		setError(null);
		setLoadingStep(0);

		// Loading message interval
		const interval = setInterval(() => {
			setLoadingStep((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
		}, 3000);

		try {
			// 1. Initiate Generation
			const { predictionId } = await generateImage(prompt, style);

			// 2. Poll Status
			let status = "starting";
			let outputUrl = null;

			while (status !== "succeeded" && status !== "failed") {
				await new Promise((resolve) => setTimeout(resolve, 2000));
				const check = await checkGenerationStatus(predictionId);
				status = check.status;
				if (check.output) outputUrl = check.output;
			}

			if (status === "failed" || !outputUrl) {
				throw new Error("Generation failed");
			}

			// 3. Finalize (store and blur)
			const result = await finalizeGeneration(predictionId, outputUrl);

			// 4. Update Context
			addGeneration({
				id: result.generationId,
				image: result.blurredImage,
				unlocked: false,
			});

			// Clear input on success
			setPrompt("");

		} catch (err: any) {
			console.error(err);
			setError(err.message || t("generationFailed"));
		} finally {
			clearInterval(interval);
			setIsGenerating(false);
		}
	};

	return (
		<section id="prompt-zone" className="py-20 w-full relative z-20">
			<div className="max-w-4xl mx-auto px-6">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
						{t("titlePrefix")}{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
							{t("titleHighlight")}
						</span>
					</h2>
				</div>

				<div className="bg-[#111128]/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
					{/* Glow effect behind form */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

					<div className="relative z-10 flex flex-col gap-8">
						{/* Prompt Input */}
						<div className="space-y-3">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-2">
								<Wand2 className="w-4 h-4 text-cyan-400" />
								{t("promptLabel")}
							</label>
							<textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								placeholder={t("promptPlaceholder")}
								className="w-full bg-[#0a0a1a] border border-white/10 rounded-2xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 resize-none min-h-[120px] transition-all"
								disabled={isGenerating}
							/>
						</div>

						{/* Style Selection */}
						<div className="space-y-3">
							<label className="text-sm font-medium text-gray-300 flex items-center gap-2">
								<ImageIcon className="w-4 h-4 text-cyan-400" />
								{t("styleLabel")}
							</label>
							<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
								{styles.map((s) => (
									<button
										key={s.id}
										onClick={() => setStyle(s.id)}
										disabled={isGenerating}
										className={`p-4 rounded-xl border text-left transition-all ${style === s.id
											? "bg-cyan-500/10 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
											: "bg-[#0a0a1a] border-white/5 text-gray-400 hover:border-white/20 hover:text-gray-200"
											}`}
									>
										<div className="font-semibold mb-1">{s.label}</div>
										<div className="text-xs opacity-70 leading-relaxed">{s.desc}</div>
									</button>
								))}
							</div>
						</div>

						{error && (
							<div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
								{error}
							</div>
						)}

						{/* Action Area */}
						<div className="flex flex-col items-center pt-4 border-t border-white/5">
							{isGenerating ? (
								<div className="w-full py-4 px-6 bg-[#0a0a1a] border border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center gap-3">
									<Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
									<div className="text-cyan-400 font-medium animate-pulse text-center">
										{loadingMessages[loadingStep]}
									</div>
								</div>
							) : (
								<button
									onClick={handleGenerate}
									className="w-full md:w-auto min-w-[240px] px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
								>
									<Sparkles className="w-5 h-5 group-hover:animate-pulse" />
									{t("button")}
								</button>
							)}

							{user && (
								<p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
									<Lock className="w-3 h-3" />
									{t("costInfo")}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
