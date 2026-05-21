// This file contains the function to connect to the MongoDB database using Mongoose. It uses the connection string from the environment variables and logs the connection status. If there is an error during the connection, it logs the error and exits the process.

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;