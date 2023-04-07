import {Env} from './index'

export class DurableObjectExample  {
  state: any;
  
  constructor(state: any, env: Env) {}

  async fetch(request: Request) {
    let ip = request.headers.get("CF-Connecting-IP");
    let data = await request.text();
    let storagePromise = this.state.storage.put(ip, data);
    await storagePromise;
    return new Response(ip + " stored " + data);
  }
}