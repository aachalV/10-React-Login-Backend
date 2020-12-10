const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const userRouter = require("./routes/userRoutes");

const app = express();
app.use(express.json());
app.use("/users", userRouter);

app.listen(
  process.env.PORT,
  console.log(`App started on port ${process.env.PORT}`)
);
