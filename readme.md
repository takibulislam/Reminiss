# **_Web Socket_**

A WebSocket is **a communication protocol that provides full-duplex, persistent, and bidirectional communication channels over a single TCP connection**. This bidirectional communication occurs between the client and server; there can be one or many clients, but all clients communicate with the server to send or receive messages to other clients.

So here are two important aspects to focus:

1. **The client** uses the **WebSocket API** available in modern browsers.
   - This is the **built-in browser API** (`new WebSocket(url)`) used to open a connection, send, and receive messages.
   - It doesn't need any external library.
2. **The WebSocket server** is created using backend technologies like Node.js, Python, etc.
   - In **Node.js**, the commonly used package is `"ws"` to create and manage the WebSocket server.
   - The server listens for client connections and can relay messages between them.

### **Client / Server architecture ( Request / Response)**

- **Client**: Browser, JS, Python app, any app that makes HTTP requests.
- **Server**: HTTP web server. eg, Apache, Tomcat, NodeJS, IIS, Python, Tornado.

To understand WebSocket from its core, we need to understand HTTP,

# HTTP

**HTTP is** built on TCP; its purpose is to request & respond. The client has to request for the server respond back, but once HTTP 1.1 introduced the “keep alive” concept, that's where Websocket comes in, to maintain a live request-response connectivity that HTTP 1.1 did not offer.

1. **HTTP Request & Response**

   **HTTP Request:**

   - URL
   - Method Type ( GET, POST, POT, DELETE)
   - Headers ( type of content: cookies/host)
   - Body (Post has a body )

   **HTTP Response:**

   - Status Code ( 404, 200, 201)
   - Headers
   - Body (JSON content, index.html)

   **An HTTP request / Response sample.**
   ![alt text](./images/http%20request%20response.png)

# **How does HTTP works?**

HTTP is a layer 7 protocol. For that, we need to learn about the OSI model.

**OSI Model:**

Operating System Interconnection (OSI) describes the 7 distinct layers used to communicate over a network. Each layer of the OSI model interacts with the layers directly above and below it, encapsulating and transmitting data in a structured manner.

All major computer and telecommunication companies adopted this model in the early 1980s, but the modern internet is not based on the OSI model but on the similar TCP/ IP model. However, the OSI 7-layer model is still widely used, as it helps visualize and communicate how networks operate.

![alt text](./images/OSI%20Model.png)
