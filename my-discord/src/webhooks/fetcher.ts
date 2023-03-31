import { globalEnv } from "../index";

type Init = Omit<RequestInit<RequestInitCfProperties>, "body"> & {
  body?: BodyInit | any;
  type?: "json" | "form";
};

const apiHost = `https://discord.com/api/v10`;

export const fetcher = async <T = any>(url: string, init?: Init) => {
  const { BOT_TOKEN } = globalEnv;
  const { type = "json" } = init || {};

  let body: BodyInit | undefined;
  let contentHeader: Record<string, string> = {};
  if (type === "json") {
    body = JSON.stringify(init?.body);
    contentHeader["Content-Type"] = "application/json";
  } else {
    body = init?.body;
  }

  const response = await fetch(`${apiHost}/${url}`, {
    ...init,
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      "User-Agent": "DiscordBot (https://discord.com, 0.1)",
      ...contentHeader,
      ...init?.headers,
    },
    body,
  });

  return response;
};

export const sendMessage = async (
  content: string,
  {
    webhookId,
    webhookToken,
  }: {
    webhookId: string;
    webhookToken: string;
  }
) => {
  const respons = await fetcher(`/webhooks/${webhookId}/${webhookToken}`, {
    method: "POST",
    body: {
      content,
    },
  });

  return respons;
};

export const sendMessageInForm = async (
  form: FormData,
  {
    webhookId,
    webhookToken,
  }: {
    webhookId: string;
    webhookToken: string;
  }
) => {
  const respons = await fetcher(`/webhooks/${webhookId}/${webhookToken}`, {
    method: "POST",
    body: form,
    type: "form",
  });

  return respons;
};
