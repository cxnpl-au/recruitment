const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Database connected.");
  })
  .catch((err) => console.log(err));

mongoose.set("strictQuery", true);

app.use(routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000...");
});
