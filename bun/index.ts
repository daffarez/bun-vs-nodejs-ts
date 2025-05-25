const server = Bun.serve({
  port: 3001,
  fetch(req) {
    return new Response("Hello from Bun!", { status: 200 });
  },
});

console.log("Bun server running on http://localhost:3001");
