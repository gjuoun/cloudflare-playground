/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { sendMessage, sendMessageInForm } from "./webhooks/fetcher";

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

  APP_ID: string;
  APP_PUBLIC_KEY: string;
  BOT_TOKEN: string;

  CHANNEL_ID: string;
  WEBHOOK_ID: string;
  WEBHOOK_TOKEN: string;
}

export let globalEnv: Env;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (!globalEnv) {
      globalEnv = env;
    }

    if (request.method === "GET") {
      return sendMessage("Hello World!", {
        webhookId: globalEnv.WEBHOOK_ID,
        webhookToken: globalEnv.WEBHOOK_TOKEN,
      });
    } else {
      const formData = new FormData();

      const body = await request.json();
      formData.append(
        "payload_json",
        JSON.stringify({
          content: "Someone is asking for help!",
        })
      );

      const file = new File([JSON.stringify(body, null, 2)], "state.json", {
        type: "application/json",
      });
      formData.append("files[1]", file);

      const res = await sendMessageInForm(formData, {
        webhookId: globalEnv.WEBHOOK_ID,
        webhookToken: globalEnv.WEBHOOK_TOKEN,
      });

      // add CORS headers
      const newHeaders = new Headers(res.headers);
      newHeaders.set("Access-Control-Allow-Origin", "*");
      newHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      newHeaders.set("Access-Control-Allow-Headers", "Content-Type");

      const newReponse = new Response(res.body, {
        headers: newHeaders,
      });

      return newReponse;
    }
  },
};
