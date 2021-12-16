const express = require("express");
const config = require("./config");
const path = require("path");
// const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const testRace = require("./races/test.json");
const dayjs = require("dayjs");
const { join } = require("path");

// const dbUrl = config.db.url;

// mongoose.connect(dbUrl, (err) => {
//   if (err) console.error(err);
//   else console.log("DB connected :)");
// });

// const Message = mongoose.model("Message", { name: String, message: String });

let tempCurrentRace = {};
let tempResults = [];
const port = config.port;
const app = express();

app.use(helmet());
app.use(cors());

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:40992",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected...", socket.id);

  socket.on("time-increment", (time) => {
    socket.broadcast.emit("time-increment", time);
  });

  socket.on("reset", (time) => {
    tempResults = [];
    socket.broadcast.emit("reset", time);
  });

  socket.on("result", ({ athlete, time }) => {
    if (!tempResults.includes(athlete)) {
      tempResults.push({
        ...athlete,
        time,
      });
    }
    socket.broadcast.emit("result", {
      pos: tempResults.length,
      athlete: athlete?.name || "Unknown",
      schoolAbr: athlete?.schoolAbr || "NA",
      year: athlete?.year || "NA",
      time,
    });
  });

  socket.on("race-selection", (currentRace) => {
    tempCurrentRace = currentRace;
    socket.broadcast.emit("race-selection", currentRace);
  });

  socket.on("newMessage", (message) => {
    socket.broadcast.emit("newMessage", message);
  });
});

app.get("/api/v1/load-meet", (req, res, next) => {
  try {
    res.sendFile(join(__dirname, "races/test.json"));
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/load-race", (req, res, next) => {
  try {
    res.json(tempCurrentRace);
  } catch (error) {
    next(error);
  }
});

app.use("*", (req, res, next) => {
  try {
    res.status(404).sendFile(path.join(__dirname, "/public/lost.html"));
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ err, message: "An error occurred on the server :(" });
});

server.listen(port, () => console.log(`Server listening on port: ${port}...`));
