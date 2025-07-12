import CONFIG from "./config.js";

// handlers
const chat = document.getElementById("chat");
const connectionStatus = document.getElementById("connection-update");
const statusLight = document.getElementById("Status");
const chatInputField = document.getElementById("input-chat");
const sendBtn = document.getElementById("send-btn");
const name = document.getElementById("name");

// Client websocket connection
const socket = new WebSocket(CONFIG.WS_URL);

// onopen | only fires when client socket connected to the server
socket.addEventListener("open", (open) => {
  console.log(open);
  clientStatus(open.currentTarget);
});

// onmessage | fires  when client receives message from server
socket.addEventListener("message", (message) => {
  //Parsing JSON
  const incomingMessage = JSON.parse(message.data).message;
  chatUpdate(incomingMessage);
  const userId = JSON.parse(message.data).clientID;
  name.innerHTML = userId;
});

// onclose | fires when connection closed
//* State of connection -> 0: Connecting, 1: Open, 2: Closing, 3: Closed
socket.addEventListener("close", (close) => {
  console.log("Connection closed");
  clientStatus(close);
});

// onerror | fires when there is an error
socket.addEventListener("error", (error) => {
  console.log(`error connection: ${error}`);
});

// Update chat to the frontEnd
function chatUpdate(data) {
  chat.innerHTML += `<p class="display-chat">${data}</p>`;
  chatInputField.value = "";
}

// Update client Status
function clientStatus(State) {
  State.readyState === 1
    ? (connectionStatus.innerHTML += `<p>Connected to the server</p>`)
    : (connectionStatus.innerHTML += `<p>Client Left the chat</p>`);
}

// Sending messages
sendBtn.addEventListener("click", (click) => {
  let chatInputFieldValue = chatInputField.value;
  chatUpdate(chatInputFieldValue);
});
