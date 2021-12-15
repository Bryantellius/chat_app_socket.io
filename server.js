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

// const dbUrl = config.db.url;

// mongoose.connect(dbUrl, (err) => {
//   if (err) console.error(err);
//   else console.log("DB connected :)");
// });

// const Message = mongoose.model("Message", { name: String, message: String });

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
    let athleteFound = testRace.entries.find((val) => val.athleteId == athlete);
    if (!tempResults.includes(athleteFound)) {
      tempResults.push({
        ...athleteFound,
        time,
      });
    }
    socket.broadcast.emit("result", {
      pos: tempResults.length,
      athlete: athleteFound?.name || "Unknown",
      school: athleteFound?.schoolAbr || "NA",
      year: athleteFound?.year || "NA",
      time,
    });
  });
});

// app.get("/messages", (req, res, next) => {
//   try {
//     Message.find({}, (err, data) => {
//       if (err) next(err);
//       res.status(200).json(data);
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// app.post("/messages", (req, res, next) => {
//   try {
//     console.log(req.body);
//     let newMessage = new Message(req.body);
//     newMessage.save((err) => {
//       if (err) next(err);
//       io.emit("message", req.body);
//       res.status(200).json({ message: "Successfully sent message!" });
//     });
//   } catch (error) {
//     next(error);
//   }
// });

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
