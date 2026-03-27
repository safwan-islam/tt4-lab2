const express = require("express");
const authRouter = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");


const app = express();

app.use(express.json());


app.use("/auth", authRouter);
app.use("/tasks", taskRouter);


module.exports = app;