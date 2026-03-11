import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
	console.error(
		"⚠️  Missing STRIPE_SECRET_KEY environment variable.",
	);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
	apiVersion: "2026-02-25.clover",
	typescript: true,
});
