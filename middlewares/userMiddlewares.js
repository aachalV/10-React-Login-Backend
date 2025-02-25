const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const AppError = require("../helpers/appError");

const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const checkRequestBody = (req, res, next) => {
  let validationArray;
  switch (req.url) {
    case "/signup":
      validationArray = ["email", "password"];
      break;
    case "/login":
      validationArray = ["email", "password"];
      break;
    default:
      return sendErrorMessage(
        new AppError(400, "Unsuccessfull", "requested url not present"),
        req,
        res
      );
  }
  //let validationArray = ["email", "password", "confirmPassword"];
  let result = validationArray.every((key) => {
    return req.body[key] && req.body[key].trim().length;
  });
  if (!result) {
    return sendErrorMessage(
      new AppError(400, "Unsuccesfull", "Invalid Request body"),
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
    return res.send("User already registered");
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
//if authenticated ..generate jwt token
const isUserRegistered = (req, res, next) => {
  let findUser = users.find((user) => {
    return user.email == req.body.email;
  });
  if (!findUser) {
    // return sendErrorMessage(
    //   new AppError(422, "Unsuccessful", "User not registered"),
    //   req,
    //   res
    // );
    return res.send("User not registered, Sigup first");
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
