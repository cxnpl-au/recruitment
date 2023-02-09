const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["Admin", "Contributor", "Viewer"],
    required: true,
  },
  organisation: {
    type: Schema.Types.ObjectId,
    ref: "Organisation",
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Account already exists, please login."],
  },
  password: {
    type: String,
    required: true,
  },
});

// UserSchema.pre("save", function (next) {
//   let user = this;
//   const saltRounds = 10;

//   // password is only hashed if new/changed
//   if (!user.isModified("password")) return next();

//   // bcrypt.genSalt(saltRounds, function (err, salt) {
//   //   if (err) return next(err);

//   // hash the password using salt
//   bcrypt.hash(user.password, saltRounds).then((hash) => {
//     user.password = hash;
//   });
// });
// });

// UserSchema.methods.comparePassword = async (input) => {
//   // const res = await bcrypt.compare(input, this.password)
//   // return res

//   bcrypt.compare(input, this.password, (err, resp) => {
//     return resp;
//   });
// };

module.exports = mongoose.model("User", UserSchema);
