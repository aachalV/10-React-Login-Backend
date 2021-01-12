const express = require("express");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cors = require("cors");

const userRouter = require("./routes/userRoutes");
const protectRoute = require("./middlewares/protectRoute");
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/dashboard", protectRoute, (req, res) => {
  //console.log("Headers :", req.header);
  console.log("Current User :", req.currentUser);
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});
app.use("/users", userRouter);

app.listen(
  process.env.PORT || 3000,
  console.log(`App started on port ${process.env.PORT}`)
);
