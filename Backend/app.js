const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./Routes/users");
const agentRouter = require("./Routes/agent");
const authRouter = require("./Routes/auth");
const http = require('http');
const socketIO = require('socket.io');
const messagesRoutes = require('./Routes/messageRoute');
const { join } = require('node:path');




const server = http.createServer(app);
const io = socketIO(server);
   




io.on('connection', (socket) => {
    console.log('A user connected');

    // Notify all clients that a user has connected
    io.emit('user connected', 'A user connected');

    // Handle chat messages
    socket.on('chat message', (msg) => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg); // Broadcast the message to all connected clients
    });

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('User disconnected');
        // Notify all clients that a user has disconnected
        io.emit('user disconnected', 'A user disconnected');
    });
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});




const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.ORIGIN,
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);

app.use("/api/v1", authRouter);
app.use(authenticationMiddleware);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/agents", agentRouter);
app.use("/api/v1/messages", messagesRoutes);




const db_name = process.env.DB_NAME;
const db_url="mongodb://127.0.0.1:27017/SE_Project1";

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

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});