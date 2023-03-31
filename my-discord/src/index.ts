/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;

	APP_ID: string,
	APP_PUBLIC_KEY: string,
	BOT_TOKEN: string,

	CHANNEL_ID: string,
	WEBHOOK_ID: string,
	WEBHOOK_TOKEN: string
}

const apiHost = `https://discord.com/api/v10`

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const {
			APP_ID,APP_PUBLIC_KEY,BOT_TOKEN,CHANNEL_ID,WEBHOOK_ID,WEBHOOK_TOKEN
		} = env
		const respons = await fetch(`${apiHost}/webhooks/${WEBHOOK_ID}`, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bot ${BOT_TOKEN}`,
				"User-Agent": "DiscordBot (https://discord.com, 0.1)"
			}
		})


		return respons
	},
};
