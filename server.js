const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { createServer } = require("http");
const { Server } = require("socket.io");

const pass = "FcLpfive5";

const dbUrl =
  "mongodb+srv://root:" +
  pass +
  "@cluster0.mdypm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(dbUrl, (err) => {
  if (err) console.error(err);
  else console.log("DB connected :)");
});

const Message = mongoose.model("Message", { name: String, message: String });

const port = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected...", socket.id);
});


app.get("/messages", (req, res, next) => {
  try {
    Message.find({}, (err, data) => {
      if (err) next(err);
      res.status(200).json(data);
    });
  } catch (error) {
    next(error);
  }
});

app.post("/messages", (req, res, next) => {
  try {
    console.log(req.body);
    let newMessage = new Message(req.body);
    newMessage.save((err) => {
      if (err) next(err);
      io.emit("message", req.body);
      res.status(200).json({ msg: "Successfully sent message!" });
    });
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
  res.status(500).json({ err, custom: "An error occurred on the server :(" });
});

server.listen(port, () => console.log(`Server listening on port: ${port}...`));
