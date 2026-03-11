import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
	const body = await req.text();
	const signature = (await headers()).get("Stripe-Signature") as string;

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET!
		);
	} catch (err: any) {
		console.error("Webhook signature verification failed.", err.message);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}

	const supabaseAdmin = createAdminClient();

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const sessionId = session.id;

		try {
			// Find pending transaction
			const { data: existingTx, error: txError } = await supabaseAdmin
				.from("Transaction")
				.select("*")
				.eq("stripeSessionId", sessionId)
				.single();

			if (txError || !existingTx) {
				console.error("Transaction not found for session:", sessionId);
				return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
			}

			// Idempotency check
			if (existingTx.status === "COMPLETED") {
				return NextResponse.json({ message: "Already processed" }, { status: 200 });
			}

			const userId = existingTx.userId;
			const addedCredits = existingTx.credits;

			// Fetch user current credits
			const { data: user, error: userError } = await supabaseAdmin
				.from("user")
				.select("credits")
				.eq("id", userId)
				.single();

			if (userError || !user) throw new Error("User not found");

			// Update transaction status
			await supabaseAdmin
				.from("Transaction")
				.update({ status: "COMPLETED", stripePaymentIntentId: session.payment_intent as string })
				.eq("id", existingTx.id);

			// Add credits to wallet
			await supabaseAdmin
				.from("user")
				.update({ credits: user.credits + addedCredits })
				.eq("id", userId);

			console.log(`Successfully added ${addedCredits} credits to user ${userId}`);
		} catch (error) {
			console.error("Error processing fulfillment:", error);
			return NextResponse.json({ error: "Database fulfillment failed" }, { status: 500 });
		}
	}

	return NextResponse.json({ received: true }, { status: 200 });
}
