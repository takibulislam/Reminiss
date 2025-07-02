import { createServer } from "node:http";
import { setupWebsocket } from "./handler.js";

// HTTP Server
const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  console.log(`${req.method}`);
  console.log(`${req.url}`);
  res.end(" Hello World");
});

// Setting up websocket Server by passing the http server. this function contain websocket features in the handler.js file
setupWebsocket(server);

server.listen(8080, () => {
  console.log("Server is running at port 8080");
});
