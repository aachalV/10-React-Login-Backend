const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const User = require("../models/userModel");
const AppError = require("../helpers/appError");
const { generateToken } = require("../helpers/jwtAuthentication");

const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

// Middlewares

const signUpUser = (req, res, next) => {
  //create new user
  let newUser = new User(req.body.email, req.body.password);
  console.log("New User", newUser);
  users.push(newUser);
  fs.writeFile(fileName, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      res.send("internal error");
      return err;
    }
    res.send("New user created");
  });
};
const loginUser = async (req, res, next) => {
  console.log("Current User", req.currentUser);
  try {
    //if psw matches
    let result = await bcrypt.compare(
      req.body.password,
      req.currentUser.password
    );
    if (!result) {
      return sendErrorMessage(
        new AppError(401, "Unsuccessful", "password is incorrect"),
        req,
        res
      );
    }

    //generate jwt token
    let jwtToken = await generateToken(
      { email: req.currentUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    //attach it to cookie
    res.cookie("jwt", jwtToken);
    res.status(200).json({
      status: "Successful login",
      data: [
        {
          jwt: jwtToken,
        },
      ],
    });
    //res.send("User logged in succesfully");
    console.log("Generated Token", jwtToken);
  } catch (err) {
    return sendErrorMessage(
      new AppError(500, "Unsuccessful", "Internal Error"),
      req,
      res
    );
  }
};

module.exports.signUpUser = signUpUser;
module.exports.loginUser = loginUser;
