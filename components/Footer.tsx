"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("Footer");

	return (
		<footer className="bg-[#05050a] text-gray-400 pt-16 pb-8 border-t border-cyan-500/10">
			<div className="max-w-6xl mx-auto px-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
					<div>
						<Link href="/" className="block mb-4">
							<span className="text-2xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-blue-500">PIXELIORA</span>
						</Link>
						<p className="text-sm leading-relaxed max-w-xs text-gray-500">
							{t("description")}
						</p>
					</div>

					<div>
						<h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
							{t("product")}
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									href={{ pathname: "/", hash: "prompt-zone" }}
									className="hover:text-cyan-400 transition-colors"
								>
									{t("uploadPhoto")}
								</Link>
							</li>
							<li>
								<Link
									href={{ pathname: "/", hash: "pricing" }}
									className="hover:text-cyan-400 transition-colors"
								>
									Pricing
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
							{t("legal")}
						</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link
									href="/privacy"
									className="hover:text-cyan-400 transition-colors"
								>
									{t("privacy")}
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="hover:text-cyan-400 transition-colors"
								>
									{t("terms")}
								</Link>
							</li>
							<li>
								<Link
									href="/contacts"
									className="hover:text-cyan-400 transition-colors"
								>
									{t("contacts")}
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="pt-8 border-t border-cyan-500/10 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
					<div>
						© {new Date().getFullYear()} Pixeliora. {t("rights")}{" "}
						<a
							href="https://enimble.pt"
							target="_blank"
							rel="noopener noreferrer"
							style={{ color: '#06b6d4', fontWeight: 'bold', textDecoration: 'none' }}
						>
							E-Nimble
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
