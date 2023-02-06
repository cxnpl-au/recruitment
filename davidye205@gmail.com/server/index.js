const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
//Import Routes
const userRoute = require("./routes/user");
const userPermissionRoute = require("./routes/permission");
const resourceRoute = require("./routes/resource");

const app = express();
const PORT = process.env.PORT || 8080;

dotenv.config();

//Connect to DB
mongoose
  .connect(process.env.MONGODB_URI || process.env.LOCAL_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

//Middleware
app.use(express.json());
app.use(cors());

//Route Middlewares
app.use("/api/users", userRoute);
app.use("/api/permissions", userPermissionRoute);
app.use("/api/resources", resourceRoute);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("../client/build"));
}

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
