console.log("Hello World!");

const socket = io();

let connectionBubble = document.querySelector("#connectionBubble");

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
