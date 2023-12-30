import WebSocket from "tauri-plugin-websocket-api";
import "./style.css";

let ws: WebSocket;

document.addEventListener("DOMContentLoaded", async () => {
  document.querySelector("#send")?.addEventListener("click", send);
  document.querySelector("#disconnect")?.addEventListener("click", disconnect);
  await connect();
});

function _updateResponse(returnValue: unknown) {
  const msg = document.createElement("p");
  msg.textContent =
    typeof returnValue === "string" ? returnValue : JSON.stringify(returnValue);
  document.querySelector("#response-container")?.appendChild(msg);
}

async function connect() {
  try {
    ws = await WebSocket.connect("ws://127.0.0.1:8080").then((r) => {
      _updateResponse("Connected");
      return r;
    });
    ws.addListener(_updateResponse);
  } catch (e) {
    _updateResponse(e);
  }
}

function send() {
  ws.send((<HTMLInputElement>document.getElementById("msg-input"))?.value || "")
    .then(() => _updateResponse("Message sent"))
    .catch(_updateResponse);
}

function disconnect() {
  ws.disconnect()
    .then(() => _updateResponse("Disconnected"))
    .catch(_updateResponse);
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <input type="text" id="msg-input" />
    <button id="send">send</button>
    <button id="disconnect">disconnect</button>
    <div id="response-container"></div>
  </div>
`;
