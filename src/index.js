import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

// Connect to MongoDB
connectDB()
  .then(() => {
    app.on("error from app.on", (err) => {
      console.error(err + "im from index.js");
      throw err;
    });
    app.listen(process.env.PORT || 7056, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("MONGODB CONNECTION FAILED: " + err));
