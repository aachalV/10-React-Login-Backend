const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const AppError = require("../helpers/appError");

const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const checkRequestBody = (req, res, next) => {
  // validationArray contains list of keys that to be present
  //signUp
  // validationArray = ["email","password","confirmPassword"]
  //login
  //validationArray = ["email","password"]
  let validationArray;
  switch (req.url) {
    case "/signup":
      validationArray = ["email", "password", "confirmPassword"];
      break;
    case "/login":
      validationArray = ["email", "password"];
      break;
    default:
      return sendErrorMessage(
        new AppError(400, "unsuccessful", "requested url not present"),
        req,
        res
      );
  }
  //let validationArray = ["email", "password", "confirmPassword"];
  let result = validationArray.every((key) => {
    return req.body[key] && req.body[key].trim().length;
  });
  if (!result) {
    //return res.send("Invalid Body");
    return sendErrorMessage(
      new AppError(400, "Unsuccesful", "Invalid Request body"),
      req,
      res
    );
  }
  next();
};

const isEmailValid = (req, res, next) => {
  next();
};
const checkConfirmPassword = (req, res, next) => {
  if (req.body.password !== req.body.confirmPassword) {
    return res.send("Confirm psw and psw does not match");
  }
  next();
};
const isEmailUnique = (req, res, next) => {
  let findUser = users.find((user) => {
    return user.email == req.body.email;
  });
  if (findUser) {
    return res.send("user already registered");
  }
  next();
};
const createPasswordHash = async (req, res, next) => {
  try {
    let salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hashSync(req.body.password, salt);
    next();
  } catch (err) {
    return sendErrorMessage(
      new AppError(500, "Unsuccessful", "Internal Error"),
      req,
      res
    );
  }
};

//login funct
// check for email & psw in body
//check if email & psw are not empty
//check if email exists in the db
//
// find user with the email
// compare the psw with hash
const isUserRegistered = (req, res, next) => {
  let findUser = users.find((user) => {
    return user.email == req.body.email;
  });
  if (!findUser) {
    return sendErrorMessage(
      new AppError(422, "Unsuccessful", "User not registered"),
      req,
      res
    );
  }
  req.currentUser = { ...findUser };
  next();
};
module.exports.checkRequestBody = checkRequestBody;
module.exports.isEmailValid = isEmailValid;
module.exports.checkConfirmPassword = checkConfirmPassword;
module.exports.isEmailUnique = isEmailUnique;
module.exports.createPasswordHash = createPasswordHash;

module.exports.isUserRegistered = isUserRegistered;
