import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;


export const POST: APIRoute = async ({ request }) => {
	const data = await request.json() as {
		name: string;
		email: string;
		message: string;
	};

	const name = data.name;
	const email = data.email;
	const message = data.message;

	if (!name || !email || !message) {
		return new Response(
			JSON.stringify({
				error: "All fields are required."
			}),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json"
				}
			}
		);
	}

	// Save the message to D1
	await env.contacts_db
		.prepare(
			"INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
		)
		.bind(name, email, message)
		.run();

	// Send a notification to Discord
	await fetch(env.DISCORD_WEBHOOK_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			embeds: [
				{
					title: "New Website Contact",
					fields: [
						{
							name: "Name",
							value: name
						},
						{
							name: "Email",
							value: email
						},
						{
							name: "Message",
							value: message
						}
					],
					timestamp: new Date().toISOString()
				}
			]
		})
	});

	return new Response(
		JSON.stringify({
			success: true
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json"
			}
		}
	);
};