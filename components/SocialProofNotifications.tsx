"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface Notification {
	id: number;
	name: string;
	message: string;
	timeAgo: string;
}

export default function SocialProofNotifications() {
	const t = useTranslations("SocialProofNotifications");
	const [activeNotification, setActiveNotification] =
		useState<Notification | null>(null);
	const [isVisible, setIsVisible] = useState(false);

	// Get localized data from translations
	const names = t.raw("names");
	const messagesTemplates = t.raw("messages");

	useEffect(() => {
		let isMounted = true;
		let showTimer: NodeJS.Timeout;
		let hideTimer: NodeJS.Timeout;

		const showNextNotification = () => {
			if (!isMounted) return;

			// Generate random notification
			const name = names[Math.floor(Math.random() * names.length)];
			const template =
				messagesTemplates[Math.floor(Math.random() * messagesTemplates.length)];
			const timeValue = Math.floor(Math.random() * 59) + 1; // 1-59

			setActiveNotification({
				id: Date.now(),
				name,
				message: template.replace("{name}", name),
				timeAgo: `${timeValue}m ago`,
			});

			setIsVisible(true);

			// Hide after 5 seconds
			hideTimer = setTimeout(() => {
				if (isMounted) setIsVisible(false);
			}, 5000);

			// Schedule next notification (between 15 and 35 seconds)
			const nextDelay = Math.floor(Math.random() * 20000) + 15000;
			showTimer = setTimeout(showNextNotification, nextDelay);
		};

		// Initial delay before first notification
		showTimer = setTimeout(showNextNotification, 8000);

		return () => {
			isMounted = false;
			clearTimeout(showTimer);
			clearTimeout(hideTimer);
		};
	}, [names, messagesTemplates]);

	if (!activeNotification) return null;

	return (
		<div
			className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${isVisible
				? "translate-y-0 opacity-100"
				: "translate-y-8 opacity-0 pointer-events-none"
				}`}
		>
			<div className="bg-[#111128]/95 backdrop-blur-md border border-cyan-500/20 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] rounded-2xl p-4 flex gap-4 w-80 relative overflow-hidden group">
				{/* Accent line */}
				<div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-600" />

				<button
					onClick={() => setIsVisible(false)}
					className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"
				>
					<X className="w-4 h-4" />
				</button>

				<div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
					<Sparkles className="w-5 h-5" />
				</div>

				<div>
					<p className="text-white text-sm font-medium leading-snug drop-shadow-md pr-4">
						<span className="font-bold text-cyan-400">
							{activeNotification.name}
						</span>{" "}
						{activeNotification.message.replace(activeNotification.name, "")}
					</p>
					<p className="text-gray-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
						<span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
						{activeNotification.timeAgo}
					</p>
				</div>
			</div>
		</div>
	);
}
