import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const httpServer = createServer((req, res) => {});

//websocket server
const wsServer = new WebSocketServer({
  server: httpServer,
});

wsServer.on("connection", (websocket, req) => {
  // console.log(websocket.eventNames);
  console.log("Someone connected to the server");

  websocket.on("close", () => {
    console.log("Someone closed the connection");
  });

  websocket.on("", () => {
    console.log("Someone closed the connection");
  });
  websocket.send;
});

wsServer.on("error", (w) => {});

httpServer.listen(8080);
