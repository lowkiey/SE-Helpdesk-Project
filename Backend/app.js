const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./Routes/users");
const authRouter = require("./Routes/auth");
const messagesRouter = require("./Routes/messages");
require('dotenv').config();

const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

// Socket.IO connection handling
const userSockets = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle when a user connects
  socket.on('user_connect', (userId) => {
    userSockets[userId] = socket.id;
  });

  // Handle incoming messages from users
  socket.on('user_message', async ({ userId, message }) => {
    const agentSocketId = userSockets[userId];

    if (agentSocketId) {
      io.to(agentSocketId).emit('agent_message', { userId, message });

      // Save the message to your database if needed
      // Example: const newMessage = new Message({ userId, message });
      // await newMessage.save();
    } else {
      // Handle the case where the user is not connected to an agent
      console.log(`User ${userId} not connected to any agent.`);
    }
  });

  // Handle when a user disconnects
  socket.on('disconnect', () => {
    // Remove the user from the userSockets object
    const userId = Object.keys(userSockets).find((key) => userSockets[key] === socket.id);
    if (userId) {
      delete userSockets[userId];
      console.log(`User ${userId} disconnected.`);
    }
  });
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS,HEAD");
//   res.setHeader(
//     "Access-Control-Expose-Headers",
//     "*"
//   );

//   next();
// });

app.use("/api/v1", authRouter);
app.use(authenticationMiddleware);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messagesRouter);

const db_name = process.env.DB_NAME;
// * Cloud Connection
// const db_url = `mongodb+srv://TestUser:TestPassword@cluster0.lfqod.mongodb.net/${db_name}?retryWrites=true&w=majority`;
// * Local connection
const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1

// ! Mongoose Driver Connection

const connectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
};

mongoose
    .connect(db_url, connectionOptions)
    .then(() => console.log("mongoDB connected"))
    .catch((e) => {
        console.log(e);
    });

app.use(function (req, res, next) {
    return res.status(404).send("404");
});
app.listen(process.env.PORT, () => console.log("server started"));