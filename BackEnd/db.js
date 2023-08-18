import { config } from "dotenv";
import { connect } from "mongoose";
config();

class Database {
  username = "";
  password = "";

  constructor() {
    this.username = process.env.DB_USER;
    this.password = process.env.DB_PASS;
  }

  async connectDB() {
    if (
      (typeof this.password === "string" && this.password.length === 0) &&
      (typeof this.username === "string" && this.username.length === 0)
    )
      return { message: "Connecting to database failed" };

    try {
      await connect(
        `mongodb+srv://hamidrasool1912:${this.password}@merntaskdb.apabkyi.mongodb.net/?retryWrites=true&w=majority`
      );
      return { message: "Database connected successfully" };
    } catch (error) {
      console.log({ error });
      return { message: "Database connection failed" };
    }
  }
}

export default new Database();
