import dontenv from "dotenv";
import app from "./app";
dontenv.config({ path: "./config.env" });

import mongoose = require("mongoose");
const port = process.env.PORT!;
mongoose.connect(process.env.DATABASE_URL!).then(() => {
  console.log("Connected to database");
});

app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} environment`
  );
});
