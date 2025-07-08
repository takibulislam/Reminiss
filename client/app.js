import CONFIG from "./config.js";

// Client websocket connection
const socket = new WebSocket(CONFIG.WS_URL);

// onopen | only fires when client socket connected to the server
socket.addEventListener("open", (Event) => {
  console.log(
    `Connection opened, Terget url: ${Event.target.url} Timestampt: ${Event.timeStamp}`
  );
});

// onmessage | firess when client receives message from server
socket.addEventListener("message", (message) => {
  console.log(`Message received from the server: ${message.data}`);
});

// onclose | fires when connection closed
//* State of connection -> 0: Connecting, 1: Open, 2: Closing, 3: Closed
socket.addEventListener("close", (close) => {
  console.log("Connection closed");
  console.log(close);
});

// onerror | fires when there is an error
socket.addEventListener("error", (error) => {
  console.log(`error connection: ${error}`);
});
