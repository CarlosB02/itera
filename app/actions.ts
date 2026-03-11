"use server";

import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import Replicate from "replicate";
import sharp from "sharp";

const replicate = new Replicate({
	auth: process.env.REPLICATE_API_TOKEN,
});

export async function generateImage(prompt: string, style: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("Must be logged in to generate images.");
	}

	// 1. Get user credits
	const { data: userData } = await supabase
		.from("user")
		.select("credits")
		.eq("id", user.id)
		.single();

	if (!userData || userData.credits < 30) {
		throw new Error("Insufficient credits. Need at least 30.");
	}

	// 2. Enhance prompt based on style
	let finalPrompt = prompt;
	if (style === "photorealistic") {
		finalPrompt = `${prompt}, photorealistic, highly detailed, 8k resolution, cinematic lighting, sharp focus`;
	} else if (style === "anime") {
		finalPrompt = `${prompt}, high quality anime style, studio ghibli, vibrant colors, detailed background`;
	} else if (style === "fantasy") {
		finalPrompt = `${prompt}, fantasy concept art, magical, ethereal, glowing, highly detailed, trending on artstation`;
	} else if (style === "concept") {
		finalPrompt = `${prompt}, concept art, sci-fi, cyberpunk, neon lights, dark moody atmosphere`;
	}

	// 3. Call Replicate (using a standard text-to-image stable diffusion model)
	const prediction = await replicate.predictions.create({
		version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f", // SDXL version or similar
		input: {
			prompt: finalPrompt,
			negative_prompt: "disfigured, blurry, low quality, bad anatomy, deformed",
			num_outputs: 1,
			scheduler: "K_EULER",
			num_inference_steps: 30,
			guidance_scale: 7.5,
		},
	});

	return { predictionId: prediction.id };
}

export async function checkGenerationStatus(predictionId: string) {
	const prediction = await replicate.predictions.get(predictionId);
	return {
		status: prediction.status,
		output: prediction.output ? prediction.output[0] : null,
	};
}

export async function finalizeGeneration(
	predictionId: string,
	outputUrl: string,
) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("Unauthorized");

	// 1. Fetch the result image
	const response = await fetch(outputUrl);
	const imageBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(imageBuffer);

	// 2. Create heavy blurred version
	const blurredBuffer = await sharp(buffer)
		.blur(25)
		.jpeg({ quality: 50 })
		.toBuffer();

	// 3. Upload both to Supabase Storage
	const originalFileName = `${user.id}/${predictionId}-hd.jpg`;
	const blurredFileName = `${user.id}/${predictionId}-blurred.jpg`;

	await Promise.all([
		supabase.storage
			.from("generations")
			.upload(originalFileName, buffer, { contentType: "image/jpeg" }),
		supabase.storage
			.from("generations")
			.upload(blurredFileName, blurredBuffer, {
				contentType: "image/jpeg",
			}),
	]);

	const { data: originalUrl } = supabase.storage
		.from("generations")
		.getPublicUrl(originalFileName);
	const { data: blurredUrl } = supabase.storage
		.from("generations")
		.getPublicUrl(blurredFileName);

	// 4. Save to Database
	const { data: generation, error: dbError } = await supabase
		.from("Generation")
		.insert({
			userId: user.id,
			prompt: "text-prompt", // keeping short
			style: "generated",
			originalImage: originalUrl.publicUrl,
			blurredImage: blurredUrl.publicUrl,
			cost: 30,
			unlocked: false,
			status: "COMPLETED",
		})
		.select()
		.single();

	if (dbError) {
		console.error("DB Error:", dbError);
		throw new Error("Failed to save generation");
	}

	return {
		generationId: generation.id,
		blurredImage: blurredUrl.publicUrl,
	};
}

export async function unlockImage(generationId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("Unauthorized");

	// First check credits
	const { data: userData } = await supabase
		.from("user")
		.select("credits")
		.eq("id", user.id)
		.single();

	if (!userData || userData.credits < 30) {
		throw new Error("Insufficient credits");
	}

	// Double check generation belongs to user and is locked
	const { data: gen } = await supabase
		.from("Generation")
		.select("id, unlocked, originalImage")
		.eq("id", generationId)
		.eq("userId", user.id)
		.single();

	if (!gen) throw new Error("Generation not found");
	if (gen.unlocked) return { originalImage: gen.originalImage };

	// Deduct credits and unlock (doing sequentially as RPC might not exist)
	const { error: updateCreditErr } = await supabase
		.from("user")
		.update({ credits: userData.credits - 30 })
		.eq("id", user.id);

	if (updateCreditErr) throw new Error("Failed to deduct credits");

	const { error: unlockErr } = await supabase
		.from("Generation")
		.update({ unlocked: true })
		.eq("id", generationId);

	if (unlockErr) {
		// Rollback credits ideally
		throw new Error("Failed to unlock");
	}

	return { originalImage: gen.originalImage };
}

export async function buyCredits(packageId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) throw new Error("Unauthorized");

	const packages: Record<string, { price: number; credits: number }> = {
		pixeliora_explorer: { price: 500, credits: 200 },
		pixeliora_creator: { price: 1500, credits: 850 },
		pixeliora_studio: { price: 2500, credits: 1800 },
	};

	const pkg = packages[packageId];
	if (!pkg) throw new Error("Invalid package");

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "eur",
					product_data: {
						name: `Pixeliora ${packageId.split("_")[1].toUpperCase()} Package`,
						description: `${pkg.credits} Credits for AI Creation`,
					},
					unit_amount: pkg.price,
				},
				quantity: 1,
			},
		],
		mode: "payment",
		success_url: `${process.env.NEXT_PUBLIC_APP_URL}/?success=true`,
		cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?canceled=true`,
		metadata: {
			userId: user.id,
			credits: pkg.credits.toString(),
		},
	});

	// Create pending transaction record
	await supabase.from("Transaction").insert({
		userId: user.id,
		amount: pkg.price,
		currency: "eur",
		status: "PENDING",
		credits: pkg.credits,
		stripeSessionId: session.id
	});

	return { sessionId: session.id };
}

export async function getCredits() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return 0;

	const { data: userData } = await supabase
		.from("user")
		.select("credits")
		.eq("id", user.id)
		.single();

	return userData?.credits || 0;
}

export async function getUserGenerations() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return [];

	const { data: generations } = await supabase
		.from("Generation")
		.select("*")
		.eq("userId", user.id)
		.order("createdAt", { ascending: false });

	return (
		generations?.map((g) => ({
			id: g.id,
			image: g.unlocked ? g.originalImage : g.blurredImage,
			unlocked: g.unlocked,
		})) || []
	);
}
