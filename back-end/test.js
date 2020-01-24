const bcrypt = require("bcryptjs");
const uuid = require("uuid/v4");

// // var salt = bcrypt.genSaltSync(10);
// var hash = "$2a$10$9BB6Hd/plXtzT8SvUzSGJu2Z4UDr2kI2ZVbQ1uyEXDlUhpl4nAAE2";

// // console.log(hash);

// console.log(bcrypt.compareSync("12345", hash)); // true
// console.log(bcrypt.compareSync("123456", hash)); // false

console.log(uuid());
