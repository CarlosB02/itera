"use client";

import {
	ChevronDown,
	Coins,
	LogOut,
	Menu as MenuIcon,
	Sparkles,
	User as UserIcon,
	X,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useUI } from "@/lib/ui-context";

export default function Header() {
	const { user, credits, setCredits } = useAuth();
	const supabase = createClient();
	const { openLoginModal } = useUI();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isLangOpen, setIsLangOpen] = useState(false);
    const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const t = useTranslations("Header");
	const locale = useLocale();

	const languages = [
		{ code: "en", label: "English", flag: "🇺🇸" },
		{ code: "pt", label: "Português", flag: "🇵🇹" },
	];

	const handleLanguageChange = (newLocale: string) => {
		router.replace(pathname, { locale: newLocale });
		setIsLangOpen(false);
	};

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	const handlePricingClick = () => {
		if (pathname === "/") {
			const pricingElement = document.getElementById("pricing");
			if (pricingElement) {
				pricingElement.scrollIntoView({ behavior: "smooth" });
			}
		} else {
			router.push({ pathname: "/", hash: "pricing" } as any);
		}
	};

	return (
		<>
			<header className="fixed top-0 left-0 right-0 bg-[#06060e]/80 backdrop-blur-md z-40 border-b border-white/5">
				<div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link href="/" className="flex items-center z-50 relative group">
						<span className="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500 group-hover:from-blue-500 group-hover:via-fuchsia-500 group-hover:to-cyan-400 transition-all duration-500">
							PIXELIORA
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						<Link
							href="/"
							className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
						>
							{t("home")}
						</Link>
						<button
							onClick={handlePricingClick}
							className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
						>
							{t("pricing")}
						</button>
						<Link
							href="/about"
							className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
						>
							{t("about")}
						</Link>
						<Link
							href="/contacts"
							className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
						>
							{t("contacts")}
						</Link>
					</nav>

					<div className="flex items-center gap-4">
						{/* Language Switcher Desktop */}
						<div className="hidden md:block relative group">
							<button
								onClick={() => setIsLangOpen(!isLangOpen)}
								className="flex items-center gap-1.5 px-3 py-1.5 text-gray-300 hover:bg-white/5 rounded-lg transition-colors text-sm font-medium border border-white/5"
							>
								<span className="text-lg">{languages.find((l) => l.code === locale)?.flag}</span>
								<span className="uppercase">{locale}</span>
								<ChevronDown className="w-3 h-3 opacity-50" />
							</button>
							<div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
								<div className="bg-[#111128] rounded-xl shadow-2xl border border-white/10 p-1 w-40 flex flex-col gap-0.5">
									{languages.map((lang) => (
										<button
											key={lang.code}
											onClick={() => handleLanguageChange(lang.code)}
											className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${locale === lang.code
												? "bg-cyan-500/20 text-cyan-400 font-medium"
												: "text-gray-300 hover:bg-white/5 hover:text-white"
												}`}
										>
											<span className="text-lg">{lang.flag}</span>
											{lang.label}
										</button>
									))}
								</div>
							</div>
						</div>

						<div className="hidden md:block">
							{user ? (
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-full text-sm font-semibold border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
										<Coins className="w-4 h-4" />
										{credits} {t("credits")}
									</div>

									<div className="flex items-center gap-3 pl-4 border-l border-white/10">
										<div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
											<UserIcon className="w-4 h-4 text-gray-400" />
										</div>
										<button
											onClick={async () => {
												await supabase.auth.signOut();
												window.location.reload();
											}}
											className="text-gray-400 hover:text-red-400 transition-colors"
											title={t("signOut")}
										>
											<LogOut className="w-5 h-5" />
										</button>
									</div>
								</div>
							) : (
								<button
									onClick={openLoginModal}
									className="px-6 py-2 bg-white text-gray-900 rounded-full font-semibold hover:bg-gray-200 transition-colors text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
								>
									{t("signIn")}
								</button>
							)}
						</div>

						{/* Mobile Actions */}
						<div className="md:hidden flex items-center gap-3">
							<button
								className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 z-50 transition-transform active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
								onClick={() =>
									document
										.getElementById("prompt-zone")
										?.scrollIntoView({ behavior: "smooth" })
								}
							>
								<Sparkles className="w-5 h-5" />
							</button>

							<button
								className="flex flex-col items-center justify-center w-10 h-10 rounded-full bg-white/5 text-gray-300 border border-white/10 z-50 transition-transform active:scale-95"
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							>
								{isMobileMenuOpen ? (
									<X className="w-5 h-5" />
								) : (
									<MenuIcon className="w-5 h-5" />
								)}
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Mobile Menu Portal */}
			{mounted &&
				createPortal(
					<div
						className={`fixed inset-0 z-[100] h-[100dvh] w-screen overflow-hidden transition-all duration-300 md:hidden flex justify-end ${isMobileMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"}`}
					>
						<div className="absolute inset-0 bg-[#06060e]/95 backdrop-blur-xl" />

						<nav className="flex flex-col w-full h-full relative z-10">
							<div className="flex items-center justify-between px-6 h-16 shrink-0 border-b border-white/5">
								<Link href="/" className="flex items-center">
									<span className="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500">
                                        PIXELIORA
                                    </span>
								</Link>
								<div className="flex items-center gap-4">
									<button
										onClick={() => setIsMobileMenuOpen(false)}
										className="p-2.5 rounded-full bg-white/5 text-gray-300 transition-colors"
									>
										<X className="w-6 h-6" />
									</button>
								</div>
							</div>

							<div className="flex flex-col flex-1 justify-start items-center gap-8 px-6 py-8 overflow-y-auto w-full">
								<div className="flex flex-col items-center gap-6 w-full">
									<Link
										href="/"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-white hover:text-cyan-400 transition-colors"
									>
										{t("home")}
									</Link>

									<button
										onClick={() => {
											setIsMobileMenuOpen(false);
											handlePricingClick();
										}}
										className="text-2xl font-semibold text-white hover:text-cyan-400 transition-colors"
									>
										{t("pricing")}
									</button>

									<Link
										href="/about"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-white hover:text-cyan-400 transition-colors"
									>
										{t("about")}
									</Link>

									<Link
										href="/contacts"
										onClick={() => setIsMobileMenuOpen(false)}
										className="text-2xl font-semibold text-white hover:text-cyan-400 transition-colors"
									>
										{t("contacts")}
									</Link>

									{/* Mobile Language Accordion */}
									<div className="flex flex-col items-center w-full mt-4">
										<button
											onClick={() => setIsMobileLangOpen(!isMobileLangOpen)}
											className="flex items-center gap-2 text-xl font-semibold text-gray-400 transition-colors"
										>
											<span className="text-2xl">{languages.find((l) => l.code === locale)?.flag}</span>
											<span className="uppercase">{locale}</span>
											<ChevronDown
												className={`w-5 h-5 transition-transform duration-300 ${isMobileLangOpen ? "rotate-180" : ""}`}
											/>
										</button>

										<div
											className={`flex flex-col gap-4 items-center overflow-hidden transition-all duration-300 ${isMobileLangOpen ? "max-h-96 opacity-100 mt-6" : "max-h-0 opacity-0 mt-0"}`}
										>
											{languages.map((lang) => (
												<button
													key={lang.code}
													onClick={() => {
														handleLanguageChange(lang.code);
														setIsMobileMenuOpen(false);
													}}
													className={`flex items-center gap-3 text-lg font-medium transition-colors ${locale === lang.code
														? "text-cyan-400"
														: "text-gray-500 hover:text-white"
														}`}
												>
													<span className="text-2xl">{lang.flag}</span>
													{lang.label}
												</button>
											))}
										</div>
									</div>
								</div>

								<div className="w-16 h-1 bg-white/10 rounded-full my-4" />

								<div className="flex flex-col items-center gap-4 w-full max-w-xs">
									{user ? (
										<>
											<div className="flex items-center gap-2 text-cyan-400 font-bold bg-cyan-500/10 border border-cyan-500/20 px-8 py-4 rounded-2xl w-full justify-center text-lg shadow-[0_0_15px_rgba(6,182,212,0.15)]">
												<Coins className="w-6 h-6" />
												{credits} {t("credits")}
											</div>
											<button
												onClick={async () => {
													await supabase.auth.signOut();
													setIsMobileMenuOpen(false);
													window.location.reload();
												}}
												className="text-red-400 font-medium flex items-center justify-center gap-2 w-full py-3 hover:bg-white/5 rounded-2xl transition-colors text-lg mt-2"
											>
												<LogOut className="w-5 h-5" /> {t("signOut")}
											</button>
										</>
									) : (
										<button
											onClick={() => {
												openLoginModal();
												setIsMobileMenuOpen(false);
											}}
											className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] transition-all"
										>
											{t("signIn")}
										</button>
									)}
								</div>
							</div>
						</nav>
					</div>,
					document.body,
				)}
		</>
	);
}
