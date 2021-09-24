console.log("Hello World!");

const socket = io();

// client-side
socket.on("connect", () => {
  console.log(socket.id);
});

socket.on("disconnect", () => {
  console.log(socket.id);
});

socket.on("message", addMessage);

document.querySelector("#send").addEventListener("click", (e) => {
  let name = document.querySelector("#name");
  let message = document.querySelector("#message");
  sendMessage({
    name: name.value,
    message: message.value,
  });
  name.value = "";
  message.value = "";
});

getMessages();

function addMessage(message) {
  document.querySelector(
    "#messages"
  ).innerHTML += `<h4>${message.name}</h4><p>${message.message}</p>`;
}

function getMessages() {
  fetch("http://localhost:3001/messages")
    .then((res) => res.json())
    .then((data) => {
      data.forEach(addMessage);
    });
}

function sendMessage(message) {
  console.log(message);
  fetch("http://localhost:3001/messages", {
    mode: "cors",
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(message),
  })
    .then((res) => res.json())
    .then((res) => console.log(res))
    .catch((err) => console.error(err));
}
