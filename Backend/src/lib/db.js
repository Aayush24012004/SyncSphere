import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.mongoDB_url);
    console.log(`mongoDB connected ${connect.connection.host}`);
  } catch (error) {
    console.log("error in connecting to mongodb", error);
    process.exit(1); //1 failure
  }
};
