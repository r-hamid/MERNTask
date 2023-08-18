import { model } from "mongoose";

import User from "./schema.js";
import hashPassword from "../helpers/hashPassword.js";

class UserRoutes {
  user;

  constructor() {
    this.user = model("User", User);
  }

  async postNewUser(req, res) {
    const { body } = req;
    if (typeof body === "object" && body === null) {
      res.status(400).json({ message: "Please add valid user information." });
      return;
    }

    //:- Getting user information from body and validation
    let { name, email, password } = body;
    name = typeof name === "string" && name.length > 0 ? name : false;
    email =
      typeof email === "string" &&
      email.length > 0 &&
      email.length < 70 &&
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) ?
      email : false;
    password = typeof password === "string" && password.length >= 3 && password.length < 20 ? password : false;

    if (!(email && name && password)) {
      res.status(400).json({ message: "Body is not validated." });
      return;
    }

    //:- Password hashing
    password = hashPassword(password);
    if (!password) {
      res.status(500).json({ message: "Somehting went wrong while encrypting password. Please try again in a while" });
      return;
    }

    //:- Saving user to database
    try {
      //:- Check if email already exists or not
      const checkingEmail = await this.user.findOne({ email: email });
      if (checkingEmail) {
        res.status(400).json({ message: `User with ${email} already exists in our system.` });
        return;
      }

      const user = new this.user({
        name, email, password, tasks: []
      });
      const savedUser = await user.save();
      delete savedUser.password;
      res.status(200).json({ message: "User created successfully", data: savedUser });
    } catch (error) {
      console.log({ userCreationError: error });
      res.status(500).json({ message: "Something went wrong while creating the user." });
    }
  }

  //:- Logging User In
  async loginUser(req, res) {
    const { body } = req;
    if (typeof body === "object" && body === null) {
      res.status(400).json({ message: "For login please provide valid email address and password." });
      return;
    }

    //:- Validating body
    let { email, password } = body;
    email =
      typeof email === "string" &&
      email.length > 0 &&
      email.length < 70 &&
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email) ?
      email : false;
    password = typeof password === "string" && password.length >= 3 && password.length < 20 ? password : false;

    //:- hashing password
    password = hashPassword(password);
    if (!password) {
      res.status(500).json({ message: "Somehting went wrong while encrypting password. Please try again in a while" });
      return;
    }

    try {
      const user = await this.user.findOne({ email: email, password: password });
      if (!user) {
        res.status(400).json({ message: "Provided credentials are not correct." });
      } else {
        delete user.password;
        res.status(200).json({ message: "User logged in successfully", data: user });
      }
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: "Something went wrong while logging in the user." });
    }
  }
}

export default UserRoutes;
