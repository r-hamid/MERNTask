import Express from "express";

import Database from "./db.js";
import UserRoutes from "./user-task/userRoutes.js";
import TaskRoutes from "./user-task/taskRoutes.js";

Database.connectDB().then((message) => {
  console.log(message.message);
});

//:- Express App Setup
const app = Express();

app.use(Express.json());

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});

//:- Adding Routes for both tasks and users
const userRoutes = new UserRoutes();
app.post("/users", (req, res) => userRoutes.postNewUser(req, res));
app.post("/login", (req, res) => userRoutes.loginUser(req, res));

//:- Task Routes
const taskRoutes = new TaskRoutes();
app.post("/tasks/:userId", (req, res) => taskRoutes.addNewTask(req, res));
app.get("/tasks/:userId", (req, res) => taskRoutes.getAllTasks(req, res));

//:- Just testing Endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Hello from express, and we are alive for task management" });
});

app.listen(3000, () => {
  console.log("Express application has started");
});
