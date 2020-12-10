// const { verifyToken } = require("../helpers/jwtAuthentication");
// const fs = require("fs");
// const path = require("path");
// const sendErrorMessage = require("../helpers/sendErrorMessage");
// const AppError = require("../helpers/appError");
// const fileName = path.join(__dirname, "..", "data", "users.json");
// const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

// const protectRoute = async (req, res, next) => {
//   console.log("Headers in req body", req.headers.authorization);
//   //extract token
//   if (!req.headers.authorization) {
//     return sendErrorMessage(
//       new AppError(401, "unsuccessful", "please login or signup"),
//       req,
//       res
//     );
//   }
//   //if headers are there
//   let jwtToken = req.headers.authorization.split(" ")[1];
//   console.log("Jwt token extracted", jwtToken);
//   //check user
//   try {
//     //check verification
//     let decoded = await verifyToken(jwtToken, process.env.JWT_SECRET);
//     console.log("Result of verification", decoded);
//     if (!decoded) {
//     }
//     //check if user is available
//     let currentUser = users.find((user) => {
//       return user.email == decoded.email;
//     });

//     if (!currentUser) {
//       throw new AppError(401, "unsuccessful", "please login or signup");
//     }
//     //give access
//     req.currentUser = currentUser;
//     next();
//   } catch (err) {
//     return sendErrorMessage(err, req, res);
//   }
// };

// module.exports.protectRoute = protectRoute;

const { verifyToken } = require("../helpers/jwtAuthentication");
const fs = require("fs");
const path = require("path");
const sendErrorMessage = require("../helpers/sendErrorMessage");
const AppError = require("../helpers/appError");
const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));

const protectRoute = async (req, res, next) => {
  //   console.log("headers in req body", req.headers.authorization);
  // extract token

  // if jwt is present in auth header  or cookie
  if (!req.headers.authorization) {
    return sendErrorMessage(
      new AppError(401, "Unsuccessful", "Please login or signup"),
      req,
      res
    );
  }
  // if headers are there
  let jwtToken = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = await verifyToken(jwtToken, process.env.JWT_SECRET);
  } catch (err) {
    return sendErrorMessage(
      new AppError(401, "Unsuccesssul", "Invalid Token"),
      req,
      res
    );
  }
  let { email: currentUser } = users.find((user) => {
    return user.email == decoded.email;
  });
  if (!currentUser) {
    return sendErrorMessage(
      new AppError(401, "Unsuccesssul", "User not registered"),
      req,
      res
    );
  }
  // check verification
  req.currentUser = currentUser;
  // give access
  next();
};
module.exports = protectRoute;
