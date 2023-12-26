const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const socketIO = require("socket.io");
const { createServer } = require('node:http');
const http = require('http');

const userRouter = require("./Routes/users");
const agentRouter = require("./Routes/agent");
const ticketRouter = require("./Routes/tickets");
const authRouter = require("./Routes/auth");
const notificationRouter = require("./Routes/notification");
const messagesRouter = require("./Routes/messages");
const FAQRouter = require("./Routes/FAQ");
const reportRouter = require("./Routes/reports");
const viewRouter = require("./Routes/view");
const viewIssues = require("./Routes/issues");
const automatedWorkflowRouter = require("./Routes/AutomatedWorkflow");


require('dotenv').config();
const server = http.createServer(app);
const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
const { backupAndSaveLocally, restoreFromDropbox } = require('./backup');
const { checkChat, getAgent } = require("./Controller/messagesController")
const { get } = require("lodash")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Define the headers you want to allow
  })
);

app.use("/api/v1", authRouter);
app.use(authenticationMiddleware);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/agents", agentRouter);
app.use("/api/v1/tickets", ticketRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/FAQ", FAQRouter);
app.use("/api/v1/messages", messagesRouter);
app.use("/api/v1/reports", reportRouter);
app.use("/api/v1/view", viewRouter);
app.use("/api/v1/issues", viewIssues);
app.use("/api/v1/automatedWorkflow", automatedWorkflowRouter);

// Add Socket.IO configuration here
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust the origin to your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});




io.on('connection', async (socket) => {

  const userId = socket.handshake.query.userId;
  await getAgent('hardware')
    .then(async (agent) => {
      if (agent !== 'not available') {
        const chat = await checkChat(userId, agent._id);
        console.log(chat);
      }
    })

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

const db_name = 'SE_Project1';
const db_url = `${"mongodb://127.0.0.1:27017"}/${db_name}`;

const connectionOptions = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose
  .connect(db_url, connectionOptions)
  .then(() => {
    console.log("MongoDB connected");

    // Trigger backupAndSaveLocally every 2 hours
    setInterval(async () => {
      try {
        await backupAndSaveLocally();
        console.log("Backup completed successfully. Auto-backup after 2 hours.");
      } catch (error) {
        console.error('Error during auto-backup:', error);
      }
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds
  })

  .catch((e) => {
    console.log(e);
  });

// app.post('/restore-from-dropbox', async (req, res) => {
//   try {
//     await restoreFromDropbox();
//     res.status(200).json({ message: 'Data restored successfully!' });
//   } catch (error) {
//     console.error('Error restoring data:', error); // Log the specific error
//     res.status(500).json({ error: 'Failed to restore data. See server logs for details.' });
//   }
// });


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});