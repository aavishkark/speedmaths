import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/speedmaths";
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Warning: ${error.message}`);
    console.log("App will run in memory/offline mode until MongoDB connection is established.");
    return false;
  }
};
