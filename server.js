// Base requirements
const express = require("express");
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { generateFile } = require('./generateFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');

// Creating a server
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Port and collab bot
const PORT = 5000 || process.env.PORT;
const botName = 'Collab Bot';

// app use
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Get and post requests
app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  if (code === undefined) {
    return res.status(400).json({ success: false, error: "empty code body" });
  }
  try {
    // need to generate cpp file with content from the request
    const filepath = await generateFile(language, code);

    //run the file and send the response
    let output
    if (language === "cpp") {
      output = await executeCpp(filepath);
    } else {
      output = await executePy(filepath);
    }

    return res.json({ filepath, output });
  } catch (err) {
    res.status(500).json({ err });
  }
});

io.on('connection', socket => {
  socket.on('joinRoom', ({username, roomname}) => {
      const user = userJoin(socket.id, username, roomname);

      socket.join(user.roomname);

      socket.emit('message', formatMessage(botName, 'Welcome to chatcord'));

      socket.broadcast.to(user.roomname).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

      io.to(user.roomname).emit('roomUsers', {
          roomname: user.roomname,
          users: getRoomUsers(user.roomname)
      });
  });

  socket.on('edit', text => {
      const user = getCurrentUser(socket.id);
      io.to(user.roomname).emit('editCode', text);
  });

  socket.on('chatMessage', msg => {
      const user = getCurrentUser(socket.id);
      io.to(user.roomname).emit('message', formatMessage(user.username, msg));
  })

  socket.on('disconnect', () => {
      const user = userLeave(socket.id);
      if(user) {
          io.to(user.roomname).emit('message', formatMessage(botName, `${user.username} left`));
          io.to(user.roomname).emit('roomUsers', {
              roomname: user.roomname,
              users: getRoomUsers(user.roomname)
          });
      }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});