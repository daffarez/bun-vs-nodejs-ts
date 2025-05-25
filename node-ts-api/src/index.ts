import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello from Node.js + TypeScript!");
});

server.listen(3002, () => {
  console.log("Server running at http://localhost:3002");
});
