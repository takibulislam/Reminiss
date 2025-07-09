import { WebSocketServer } from "ws";
import { generateClientID } from "./clientID.js";
import url from "node:url";

export function setupWebsocket(server) {
  const wsServer = new WebSocketServer({ server });

  // Store connected Clients
  const clients = [];
  const connections = {};

  // Handling websocket connection
  wsServer.on("connection", (clientSocket, httpRequest) => {
    console.log("New Client connected");
    console.log(clients.length);

    // Client ID + Username and adding it to the clientSocket.
    const clientID = generateClientID();
    const { username } = url.parse(httpRequest.url, true).query;
    clientSocket.clientDetails = {
      clientID: clientID,
      username: username,
    };
    console.log(username);
    clients.push(clientSocket);

    // Server recive messags from client side.
    clientSocket.on("message", (data) => {
      console.log(`Message Recived from ${clientID}: `, data.toString());

      // Broadcast to all clients except sender
      broadcastToAll(
        JSON.stringify({
          type: "Message",
          clientID: clientID,
          message: data.toString(),
          Timestamp: new Date().toString(),
        }),
        clientSocket
      );
    });

    // Server respond to the client
    clientSocket.send(
      JSON.stringify({
        username: username,
        message: "Welcome to the chant",
        clientID: clientID,
      }),
      connections
    );
    clientSocket.on("close", () => {
      console.log(
        `Client ${clientSocket.clientDetails.username} ${clientSocket.clientDetails.clientID}is disconnected`
      );

      // Remove client from array
      const index = clients.indexOf(clientSocket);
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

    clientSocket.on("error", (error) => {
      console.error(`Error with client ${clientID}: `, error);

      // Remove client from array on error
      const index = clients.indexOf(clientSocket);
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
  });
}
