import PromptZone from "@/components/PromptZone";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";
import SocialProof from "@/components/SocialProof";
import ShowcaseSection from "@/components/ShowcaseSection";

export default function Home() {
	return (
		<div className="min-h-screen bg-[#06060e]">
			<div className="flex flex-col items-center w-full">
				<div className="w-full bg-gradient-to-b from-[#06060e] via-[#111128] to-[#06060e] flex flex-col items-center">
					<Hero />

					<PromptZone />

					<Gallery />

					<ShowcaseSection />
				</div>

				<Pricing />

				<SocialProof />
			</div>
		</div>
	);
}
