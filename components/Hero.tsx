import { Sparkles, ArrowDown } from "lucide-react";
import BackgroundGrid from "./BackgroundGrid";
import { useTranslations } from "next-intl";

export default function Hero() {
	const t = useTranslations("Hero");

	return (
		<div className="relative w-full overflow-hidden min-h-[70vh] flex flex-col justify-center items-center">
			<BackgroundGrid />

			<div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
				<div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-gray-300 font-medium text-sm shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
					{t("badge")}
				</div>

				<h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-6 leading-[1.1]">
					{t("titlePrefix")} <br />
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 animate-aurora inline-block pb-2">
						{t("titleHighlight")}
					</span>
				</h1>

				<p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
					{t("subtitle")}
				</p>

				<div className="flex justify-center animate-bounce text-gray-500 mt-8">
					<ArrowDown className="w-6 h-6" />
				</div>
			</div>
		</div>
	);
}
