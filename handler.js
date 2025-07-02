import { type } from "node:os";
import { json } from "node:stream/consumers";
import { WebSocketServer } from "ws";
import { generateClientID } from "./clientID.js";
import { error } from "node:console";
export function setupWebsocket(server) {
  const wss = new WebSocketServer({ server });

  // Store connected Clients
  const clients = [];

  // Handling websocket connection
  wss.on("connection", (ws) => {
    console.log("New Client connected");

    // Assign ID to the client
    clients.push(ws);
    const clientID = generateClientID();
    ws.clientID = clientID;

    // Server recive messags from client side.
    ws.on("message", (data) => {
      console.log(`Message Recived from ${clientID}: `, data.toString());

      // Broadcast to all clients except sender
      broadcastToAll(
        JSON.stringify({
          type: "Message",
          clientID: clientID,
          message: data.toString(),
          Timestamp: new Date().toString(),
        }),
        ws
      );
    });

    // Server respond to the client
    ws.send(
      JSON.stringify({
        type: "system",
        message: "Welcome to the chant",
        clientID: clientID,
      })
    );
    ws.on("close", () => {
      console.log(`Client ${clientID}: is disconnected`);

      // Remove client from array
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }

      // Notify other clients about disconnection
      broadcastToAll(
        JSON.stringify({
          type: "system",
          message: `User ${clientID} left the chat`,
          clientID: clientID,
        })
      );
    });

    ws.on("error", (error) => {
      console.error(`Error with client ${clientID}: `, error);

      // Remove client from array on error
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });

    // Broadcast to all Except sender
    function broadcastToAll(message, sender) {
      clients.forEach((client) => {
        if (client !== sender && client.readyState === client.OPEN) {
          client.send(message);
        }
      });
    }
    broadcastToAll();
  });
}
