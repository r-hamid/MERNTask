import { model, Types } from "mongoose";

import User from "./schema.js";

class TaskRoutes {
  user;

  constructor() {
    this.user = model("User", User);
  }

  async addNewTask(req, res) {
    const { body, params } = req;
    if (!body) {
      res.status(400).json({ message: "Please provide valid task information to create new task" });
      return;
    }

    if (!params) {
      res.status(400).json({ message: "User id is required in params." });
      return;
    }

    let { title } = body;
    title = typeof title === "string" && title.length > 0 ? title : false;
    if (!title) {
      res.status(400).json({ message: "Title of task is required to create task." });
      return;
    }

    let { userId } = params;
    userId = typeof userId === "string" && userId.length > 0 ? userId : false;
    if (!userId) {
      res.status(400).json({ message: "User id is missing from request." });
      return;
    }

    //:- Adding new task
    try {
      //:- Checking user
      const user = await this.user.findById(userId);
      if (!user) {
        res.status(400).json({ message: "Invalid user id provided" });
        return;
      }

      //:- Generating ObjectId for tasks
      const newTask = {
        id: new Types.ObjectId(),
        title
      };

      user.tasks.push(newTask);
      await user.save();

      res.status(200).json({ message: "Task created successfully", data: newTask });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: "Something went wrong while adding new task." });
    }
  }

  async getAllTasks(req, res) {
    const { params } = req;
    if (!params) {
      res.status(400).json({ message: "User id is required to fetch all tasks" });
      return;
    }

    let { userId } = params;
    userId = typeof userId === "string" && userId.length > 0 ? userId : false;
    if (!userId) {
      res.status(400).json({ message: "User id is required to fetch all tasks" });
      return;
    }

    try {
      const user = await this.user.findById(userId);
      if (!user) {
        res.status(400).json({ message: "No user with provided user id found." });
        return;
      }

      res.status(200).json({ message: "All tasks are fetched successfully", data: user.tasks });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: "Something went wrong while fetching tasks list." });
    }
  }
}

export default TaskRoutes;
