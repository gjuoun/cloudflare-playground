import { Env } from "./index";

export class CounterTs {
  state: DurableObjectState;

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
  }

  // Handle HTTP requests from clients.
  async fetch(request: Request) {
    // Apply requested action.

    // get the json payload then use its key and value to set to the storage
    if (request.method === "POST") {
      let json: any = await request.json();
      console.log("json", json);
      const promises = Object.keys(json).map((key) => {
        console.log("saved key", key, "value", json[key]);
        return this.state.storage.put(key, json[key]);
      });
      await Promise.all(promises);
      const currState = await this.state.storage.list();
      console.log("currState", currState);
      const obj = Object.fromEntries(currState.entries());
      return new Response(JSON.stringify(obj), {
        headers: { "content-type": "application/json" },
      });
    } else if (request.method === "GET") {
      const currState = await this.state.storage.list();
      const obj = Object.fromEntries(currState.entries());
      return new Response(JSON.stringify(obj), {
        headers: { "content-type": "application/json" },
      });
    } else {
      return new Response("Method not allowed", {
        status: 405,
        statusText: "Method Not Allowed",
      });
    }
  }

  async get() {
    const currState = await this.state.storage.list();
    const obj = Object.fromEntries(currState.entries());
    return obj;
  }
}
