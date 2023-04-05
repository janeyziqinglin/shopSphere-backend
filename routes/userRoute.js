const express = require("express");
const router = express.Router();
const {registerUser , loginUser,logout} = require("../controllers/userController");


//frontend send info and post to backend using the controller
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);

module.exports = router;