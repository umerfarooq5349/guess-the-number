import dotenv from "dotenv";
import app from "./app";
import mongoose from "mongoose";

// Load environment variables from config.env
dotenv.config({ path: "./config.env" });

// Get environment variables with type assertion
const port = process.env.PORT;
const dbUrl = process.env.DATABASE_URL;

if (!port) {
  throw new Error("PORT is not defined in environment variables");
}

if (!dbUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// Connect to MongoDB
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Start the server
app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} environment`
  );
});
