import { Whop } from "@whop/sdk";

export const whopsdk = new Whop({
	appID: process.env.NEXT_PUBLIC_WHOP_APP_ID || "app_placeholder",
	apiKey: process.env.WHOP_API_KEY || "placeholder_api_key",
	webhookKey: btoa(process.env.WHOP_WEBHOOK_SECRET || "placeholder_webhook_secret"),
});
