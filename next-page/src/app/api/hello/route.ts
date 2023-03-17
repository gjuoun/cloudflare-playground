export const config = {
  runtime: "experimental-edge",
};

export async function GET(request: Request) {
  return new Response('Hello, Next.js!')
}
