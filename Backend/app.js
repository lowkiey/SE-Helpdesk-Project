const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./Routes/users");
const agentRouter = require("./Routes/agent");
const ticketRouter = require("./Routes/tickets");
const authRouter = require("./Routes/auth");
const autoRouter=require("./Routes/AutomatedWorkflow");
require('dotenv').config();
const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use("/api/v1/AutomatedWorkflow", autoRouter);
app.use("/api/v1/agents", agentRouter);
app.use("/api/v1/tickets", ticketRouter);


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
    .then(() => console.log("MongoDB connected"))
    .catch((e) => {
        console.log(e);
    });

app.use(function (req, res, next) {
    return res.status(404).send("404");
});

