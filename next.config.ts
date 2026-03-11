import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			bodySizeLimit: "10mb",
		},
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "replicate.delivery",
			},
			{
				protocol: "https",
				hostname: "replicate.com",
			},
		],
	},
};

export default withNextIntl(nextConfig);
