const jwt = require("jsonwebtoken");
const util = require("util");

const secret = "Secret key for signing";
const payload = {
  email: "something@gamil.com",
};
let generateToken = util.promisify(jwt.sign);
// jwt.sign(payload, secret, { expiresIn: "1h" }, (err, token) => {
//   if (err) {
//     console.log(err);
//     return err;
//   }
//   console.log("Generated Token", token);
// });
generateToken(payload, secret, { expiresIn: "1h" }).then();
