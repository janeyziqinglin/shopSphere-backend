const mongoose = require("mongoose");

//create schema
//token need to be associated with specific user, and it should be hashedToken
const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

//create model that contain schema
const Token = mongoose.model("Token", tokenSchema);

//export model
module.exports = Token;
