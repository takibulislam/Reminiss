const express = require("express"); // Import Express.js to serve static files
const http = require("http"); // Import the HTTP module to create a server
const WebSocket = require("ws"); // Import WebSocket for real-time signaling
const path = require("path"); // Import path module to handle file paths

const app = express(); // Create an Express app
const server = http.createServer(app); // Create an HTTP server using Express
const wss = new WebSocket.Server({ server }); // Create a WebSocket server on top of the HTTP server

// 🔹 Serve the frontend (HTML, JS, CSS) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// 🔹 WebSocket Server: Handle Client Connections
wss.on("connection", (ws) => {
  console.log("New client connected");

  // Handle incoming messages from clients
  ws.on("message", (message) => {
    console.log("Received message:", message);

    // Broadcast the message to all connected clients except the sender
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message); // Relay the message (SDP, ICE candidates, etc.)
      }
    });
  });

  // Handle client disconnect event
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// 🔹 Start the HTTP & WebSocket server on port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
