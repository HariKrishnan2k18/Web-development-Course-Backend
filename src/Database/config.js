import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (req, res) => {
  try {
    const connection = await mongoose
      .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(async () => {
        const collections = await mongoose.connection.db
          .listCollections()
          .toArray();
        const collectionNames = collections.map(col => col.name);
        console.log({ collectionNames });
      });
    console.log("MongoDB Connected Successfully!");
    return connection;
  } catch (error) {
    console.log(process.env.MONGODB_URL);
    console.log(error);
  }
};
export default connectDB;
