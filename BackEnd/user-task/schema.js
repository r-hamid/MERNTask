import { Schema } from "mongoose";

const UserTaskSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: {
    type: Array,
    required: false,
  }
});

export default UserTaskSchema;
