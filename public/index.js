console.log("Hello World!");

const socket = io();

let connectionBubble = document.querySelector("#connectionBubble");
let messageForm = document.querySelector("#messageForm");
let messages = document.querySelector("#messages");
let newMessage = document.querySelector("#newMessage");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let date = new Date();

  messages.innerHTML += `<div class="card">
  <div class="card-content p-1 mb-2 notification is-primary">
    <div class="media">
      <div class="media-content">
        <p class="title is-6">${newMessage.value}</p>
      </div>
    </div>

    <div class="content">
      You
      <br>
      <time>${date.toLocaleTimeString()}</time>
    </div>
  </div>
</div>`;

  messages.scroll({
    top: 1000,
    left: 0,
    behavior: "smooth",
  });
  socket.emit("newMessage", { id: socket.id, content: newMessage.value, date });

  newMessage.value = "";
});

socket.on("newMessage", (message) => {
  messages.innerHTML += `<div class="card">
  <div class="card-content p-1 mb-2">
    <div class="media">
      <div class="media-content">
        <p class="title is-6">${message.content}</p>
      </div>
    </div>

    <div class="content">
     User
      <br>
      <time>${new Date(message.date).toLocaleTimeString()}</time>
    </div>
  </div>
</div>`;
  messages.scroll({
    top: 1000,
    left: 0,
    behavior: "smooth",
  });
});

// client-side
socket.on("connect", () => {
  console.log(socket.id);
  connectionBubble.textContent = "Connected";
  connectionBubble.classList.remove("is-danger");
  connectionBubble.classList.add("is-success");
});

socket.on("disconnect", () => {
  console.log(socket.id);
  connectionBubble.textContent = "Not Connected";
  connectionBubble.classList.add("is-danger");
  connectionBubble.classList.remove("is-success");
});

socket.on("time-increment", (time) => {
  updateTime(time);
});

socket.on("reset", (time) => {
  document.querySelector("#results > tbody").innerHTML = "";
  updateTime(time);
});

socket.on("result", addResult);

function updateTime(time) {
  document.querySelector("#time").textContent = time;
}

function addResult(result) {
  let tbody = document.querySelector("#results > tbody");
  let tr = document.createElement("tr");
  tr.innerHTML = `<td>${result.pos}</td><td>${result.athlete}</td><td>${result.school}</td><td>${result.year}</td><td>${result.time}</td>`;
  tbody.appendChild(tr);
}
