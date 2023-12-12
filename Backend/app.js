const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./Routes/users");
const agentRouter = require("./Routes/agent");
const authRouter = require("./Routes/auth");
require('dotenv').config();

const authenticationMiddleware = require("./Middleware/authenticationMiddleware");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

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

const db_name = process.env.DB_NAME;

const db_url = `${process.env.DB_URL}/${db_name}`; // if it gives error try to change the localhost to 127.0.0.1


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