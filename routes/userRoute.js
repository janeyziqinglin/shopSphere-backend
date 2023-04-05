const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleware");

//frontend send info and post to backend using the controller
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/getuser",protect, getUser); //add middleware protect 

module.exports = router;
