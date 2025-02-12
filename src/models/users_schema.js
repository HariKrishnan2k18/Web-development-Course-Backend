import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  id: { type: String },
  courseName: { type: String },
  current_video: {
    mimeType: { type: String },
    id: { type: String },
    name: { type: String }
  },
  current_folder: {
    mimeType: { type: String },
    id: { type: String },
    name: { type: String }
  }
});

const userSchema = new mongoose.Schema({
  users: [
    {
      id: { type: String },
      user: { type: String },
      password: { type: String },
      courses: [courseSchema]
    }
  ]
});

const UsersCollection = mongoose.model("userdetails", userSchema);

export default UsersCollection;
