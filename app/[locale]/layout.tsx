import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "../globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SocialProofNotifications from "@/components/SocialProofNotifications";
import OverscrollFix from "@/components/OverscrollFix";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { UIProvider } from "@/lib/ui-context";
import { GenerationProvider } from "@/lib/generationContext";
import { AuthProvider } from "@/components/AuthProvider";
import CookieBanner from "@/components/CookieBanner";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
	title: {
		template: "Pixeliora - %s",
		default: "Pixeliora — AI Image Generator",
	},
	description:
		"Transform your imagination into stunning visual art with cutting-edge AI.",
};

export default async function RootLayout({
	children,
	params
}: {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body
				className={`${outfit.variable} antialiased font-sans flex flex-col min-h-screen relative`}
				suppressHydrationWarning
			>
				<NextIntlClientProvider messages={messages}>
					<AuthProvider>
						<UIProvider>
							<GenerationProvider>
								<Header />
								<main className="flex-1 w-full pt-16 relative z-10">{children}</main>
								<Footer />
								<SocialProofNotifications />
								<OverscrollFix />
								<CookieBanner />
							</GenerationProvider>
						</UIProvider>
					</AuthProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
