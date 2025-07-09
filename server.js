import { createServer } from "node:http";
import { setupWebsocket } from "./server/handler.js";
import { readFile, readFileSync } from "node:fs";

const html = readFileSync("./client/index.html", "utf8");

// HTTP Server
const server = createServer((req, res) => {
  res.writeHead(200, "Content-Type", "text/plain");
  console.log(`${req.method}`);
  console.log(`${req.url}`);
  res.end(html);
});

// Setting up websocket Server by passing the http server. this function contain websocket features in the handler.js file
setupWebsocket(server);

server.listen(8080, () => {
  console.log("Server is running at port 8080");
});
