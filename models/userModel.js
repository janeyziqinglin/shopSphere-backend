const mongoose = require("mongoose");
// const bcrypt = require("bcrypt.js");

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Please add a name"],
      },
      email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        trim: true, //remove extra space
        //validate email, if does not pass, will return "Please enter a valid emaial"
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please enter a valid emaial",
        ],
      },
      password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"],
        //   maxLength: [30, "Password must not be more than 30 characters"],
      },
      photo: {
        type: String,
        required: [true, "Please add a photo"],
        default: "https://i.ibb.co/4pDNDk1/avatar.png",
      },
      phone: {
        type: String,
        default: "+234",
      },
      bio: {
        type: String,
        maxLength: [250, "Bio must not be more than 250 characters"],
        default: "bio",
      },
    },
    {
      timestamps: true,
    }
  );

  const User = mongoose.model("User", userSchema);
  module.exports = User;