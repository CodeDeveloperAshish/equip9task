const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("password").set(function (password) {
  this.hashedPassword = bcrypt.hashSync(password, 10);
});

userSchema.methods = {
  matchPassword: async function (password) {
    return await bcrypt.compare(password, this.hashedPassword);
  },
  generateToken: async function () {
    return jwt.sign(
      { _id: this._id, mobileNumber: this.mobileNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  },
};

const User = mongoose.model("User", userSchema);
module.exports = User;
