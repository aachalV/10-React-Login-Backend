const bcrypt = require("bcryptjs");
const util = require("util");

//convert bcrypt.gensalt into something that returns promise
const generateSalt = util.promisify(bcrypt.genSalt);
generateSalt(10)
  .then((salt) => {
    console.log("Salt from promise", salt);
  })
  .catch((err) => {
    console.log("hashed value", hash);
  });
//-----------
//sync

// const salt = bcrypt.genSaltSync(10);
// const hash = bcrypt.hashSync("password", salt);
// console.log(hash);

// console.log(hash);
// console.log(bcrypt.compareSync("password", hash));
//-------------

//Async
// bcrypt.genSalt(10, (err, salt) => {
//   if (err) {
//     console.log(err);
//     return err;
//   }
//   console.log(salt);
//   bcrypt.hash("password", salt, (err, hash) => {
//     if (err) {
//       console.log("ERROR in HAsh :", err);
//       return err;
//     }
//     console.log("hashed value : ", hash);
//     bcrypt.compare("password", hash, (err, result) => {
//       if (err) {
//         return err;
//       }
//       console.log("Compared result", result);
//     });
//   });
// });
