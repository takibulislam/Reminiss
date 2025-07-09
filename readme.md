# **Web Socket**

A WebSocket is **a communication protocol that provides full-duplex, persistent, and bidirectional communication channels over a single TCP connection**. This bidirectional communication occurs between the client and server; there can be one or many clients, but all clients communicate with the server to send or receive messages to other clients.

So here are two important aspects to focus:

1. **The client** uses the **WebSocket API** available in modern browsers.
   - This is the **built-in browser API** (`new WebSocket(url)`) used to open a connection, send, and receive messages.
   - It doesn't need any external library.
2. **The WebSocket server** is created using backend technologies like Node.js, Python, etc.
   - In **Node.js**, the commonly used package is `"ws"` to create and manage the WebSocket server.
   - The server listens for client connections and can relay messages between them.
