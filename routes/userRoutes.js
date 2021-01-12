const express = require("express");
const { signUpUser, loginUser } = require("../controllers/userController");
const {
  checkRequestBody,
  isEmailValid,
  isEmailUnique,
  createPasswordHash,
  isUserRegistered,
} = require("../middlewares/userMiddlewares");
//crete router
const router = express.Router();

router
  .route("/signup")
  .post(
    checkRequestBody,
    isEmailValid,
    isEmailUnique,
    createPasswordHash,
    signUpUser
  );

router.route("/login").post(checkRequestBody, isUserRegistered, loginUser);
router.route("/logout").get();

module.exports = router;
